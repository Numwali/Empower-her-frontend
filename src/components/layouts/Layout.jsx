import Sidebar from "../sidebar/Sidebar";
import Menu from "../menu";

const Layout = ({ children }) => {
  return (
    <>
      <div className="header">
        <div className="">
          <Menu />
          <section className="w-full">
            <div className="w-full flex justify-between pt-8">
              <div className="laptop:w-2/12 desktop:w-2/12">
                <Sidebar />
              </div>
              <div className="bg-[#80808015] flex justify-center items-start min-h-[90vh] md:px-[2vw] md:pt-20 md:pb-5 md:w-10/12  dark:bg-dark-primary">
                <br />
                {children}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Layout;
