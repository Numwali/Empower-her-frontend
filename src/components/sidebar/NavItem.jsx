import { Link } from "react-router-dom";

const NavItem = ({ item, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="flex gap-2 text-black/65 hover:text-primary text-lg mb-4 font-medium hover:font-semibold">
      <Link to={item.link ?? "#"} onClick={handleClick} className="flex flex-row justify-center items-center gap-1">
        <span className="">
          <i className={item.icon}></i>
        </span>{" "}
        <span className="link-title">{item.title}</span>
      </Link>
    </div>
  );
};

export default NavItem;