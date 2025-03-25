const formattingDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Format the date based on different cases
  if (isSameDate(date, today)) {
    return formatDate(date, "h:mm A");
  } else if (isSameDate(date, yesterday)) {
    return "Yesterday";
  } else {
    return formatDate(date, "MMM D, YYYY");
  }
};

const isSameDate = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const formatDate = (date, format) => {
  if (format === "h:mm A") {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      ...format,
    }).format(date);
  } else {
    return new Intl.DateTimeFormat("en-US", {
      // hour: "numeric",
      // minute: "numeric",
      // hour12: true,
      ...(format && { month: "short", day: "numeric", year: "numeric" }),
    }).format(date);
  }
};

export const formattingMessageGroupDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  if (isSameDate(date, today)) {
    return "Today";
  } else {
    return formatDate(date, "MMM D, YYYY");
  }
};



export function areSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formattingMessageDate(date) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return new Date(date).toLocaleTimeString([], options);
}

export default formattingDate;
