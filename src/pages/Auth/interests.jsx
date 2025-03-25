import React from 'react'
import { useState, useRef, useEffect } from "react"
import { Tag, X } from "lucide-react"

const InterestSelect = ({ value, onChange, hasError = false, errorId }) => {

    const INTEREST_SUGGESTIONS = [
        "#Anxiety",
        "#Depression",
        "#StressManagement",
        "#TraumaRecovery",
        "#GriefAndLoss",
        "#SelfEsteem",
        "#RelationshipIssues",
        "#MarriageCounseling",
        "#ParentingSupport",
        "#SingleParenting",
        "#WorkLifeBalance",
        "#CareerGuidance",
        "#LifeTransitions",
        "#Mindfulness",
        "#Meditation",
        "#Yoga",
        "#SelfCare",
        "#EmotionalHealing",
        "#CopingSkills",
        "#AngerManagement",
        "#AddictionRecovery",
        "#EatingDisorders",
        "#SleepIssues",
        "#PTSD",
        "#DomesticViolenceRecovery",
        "#SexualTrauma",
        "#PostpartumDepression",
        "#FertilitySupport",
        "#MiscarriageSupport",
        "#MenopauseSupport",
        "#WomenHealth",
        "#BodyImage",
        "#CulturalIdentity",
        "#Spirituality",
        "#FaithBasedCounseling",
        "#PersonalGrowth",
        "#ConfidenceBuilding",
        "#CommunitySupport",
        "#PeerCounseling",
        "#LGBTQ+Support",
        "#GenderBasedViolence",
        "#SexualHealth",
        "#AgingAndMentalHealth",
        "#FinancialStress",
        "#SocialAnxiety",
        "#Phobias",
        "#ChronicIllnessSupport",
        "#DisabilitySupport",
        "#FamilyTherapy",
        "#CouplesCounseling",
        "#TeenMentalHealth",
        "#ElderlyMentalHealth",
        "#CulturalTrauma",
        "#FaithAndMentalHealth",
        "#MindBodyConnection",
        "#ResilienceBuilding",
        "#Forgiveness",
        "#GratitudePractice",
        "#Happiness",
        "#InnerPeace",
        "#SelfDiscovery",
        "#SpiritualGrowth",
        "#WorkplaceStress",
        "#BurnoutRecovery",
        "#ImposterSyndrome",
        "#LeadershipCoaching",
        "#Motivation",
        "#Procrastination",
        "#TimeManagement",
        "#MindsetShift",
        "#EmotionalIntelligence",
        "#SocialSkills",
        "#BoundarySetting",
        "#SelfCompassion",
        "#PositiveParenting",
        "#DivorceSupport",
        "#BlendedFamilies",
        "#AdoptionSupport",
        "#InfertilitySupport",
        "#AgingParents",
        "#CaregiverSupport",
        "#PTSDInWomen",
        "#GenderIdentity",
        "#FeminismAndMentalHealth",
        "#CulturalStigma",
        "#CommunityHealing",
        "#PeerSupport",
        "#OnlineTherapy",
        "#GroupTherapy",
        "#Workshops",
        "#Retreats",
        "#WellnessResources",
        "#MentalHealthAwareness",
        "#BreakingTheStigma",
        "#TraditionalHealing",
        "#MaternalMentalHealth",
        "#ChildLossSupport",
        "#WidowhoodSupport",
        "#PolygamyAndMentalHealth",
        "#CulturalExpectations",
        "#WomenWithHIV/AIDS",
        "#SexWorkersMentalHealth",
        "#WomenInConflictZones",
    ];

    const [inputValue, setInputValue] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)


    // Filter suggestions based on input
    useEffect(() => {
        if (inputValue) {
            const formattedInput = inputValue.startsWith("#") ? inputValue : `#${inputValue}`
            const filtered = INTEREST_SUGGESTIONS.filter(
                (interest) => interest.toLowerCase().includes(formattedInput.toLowerCase()) && !value.includes(interest),
            )
            setSuggestions(filtered)
        } else {
            setSuggestions([])
        }
    }, [inputValue, value])

    // Handle clicks outside of suggestions to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleInputChange = (e) => {
        let newValue = e.target.value

        // Ensure input starts with #
        if (newValue && !newValue.startsWith("#")) {
            newValue = `#${newValue}`
        }

        setInputValue(newValue)
        setShowSuggestions(true)
    }

    const handleInputKeyDown = (e) => {
        // Add interest on Enter if not empty and not already in the list
        if (e.key === "Enter" && inputValue.trim() !== "" && inputValue.trim() !== "#") {
            e.preventDefault()

            const formattedValue = inputValue.trim()
            if (!value.includes(formattedValue)) {
                onChange([...value, formattedValue])
                setInputValue("")
            }
        }
        // Remove last interest on Backspace if input is empty
        else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
            onChange(value.slice(0, -1))
        }
    }

    const handleSuggestionClick = (suggestion) => {
        if (!value.includes(suggestion)) {
            onChange([...value, suggestion])
            setInputValue("")
            setShowSuggestions(false)
            inputRef.current?.focus()
        }
    }

    const removeInterest = (interest) => {
        onChange(value.filter((i) => i !== interest))
    }

    return (
        <div className="relative">
            <div
                className={`flex flex-wrap gap-2 p-2 border rounded-lg bg-white ${hasError
                    ? "border-red-500"
                    : "border-primary/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-Accent"
                    }`}
                onClick={() => inputRef.current?.focus()}
                aria-invalid={hasError}
                aria-describedby={errorId}
            >
                {value.map((interest, index) => (
                    <div key={index} className="flex items-center bg-Muted/30 text-primary px-2 py-1 rounded-full text-sm">
                        <Tag size={14} className="mr-1" />
                        <span>{interest}</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeInterest(interest)
                            }}
                            className="ml-1 text-primary/70 hover:text-primary rounded-full"
                            aria-label={`Remove ${interest}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    className="flex-grow min-w-[120px] border-none focus:outline-none focus:ring-0 p-1 text-primary placeholder:text-gray-400 text-sm"
                    placeholder={value.length === 0 ? "Add interests with #..." : "Add more..."}
                />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                    <div className="p-2">
                        <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="bg-[#f5fafd] hover:bg-Muted/20 text-primary px-2 py-1 rounded-full text-sm transition-colors flex items-center"
                                >
                                    <Tag size={14} className="mr-1" />
                                    <span>{suggestion}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InterestSelect
