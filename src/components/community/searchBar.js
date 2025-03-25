const SearchBar = () => {
  return (
    <form className="w-[450px] phone:w-[300px] relative">
      <div className="relative">
        <input
          type="search"
          placeholder="Type here"
          className="w-full text-sm px-4 py-1.5 tablet:py-2 laptop:py-2 desktop:py-2 rounded-full bg-gray-300  border-none focus:outline-none"
        />
        <button className="absolute  w-8 h-8 tablet:w-10 laptop:w-10 desktop:w-10 tablet:h-10 laptop:h-10 desktop:h-10 right-1 top-1/2 -translate-y-1/2 p-[13px] bg-Accent rounded-full flex items-center justify-center ">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
