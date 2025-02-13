import Header from "../components/header";
import Footer from "../components/footer";
import ForgotPassword from "../components/ForgotPassword";


const Forgotpassword = () => {
  return (
    <>
      <Header />
        <div className="max-w-7xl mx-auto pt-15 px-6 mt-64 mb-36">
        <ForgotPassword/>
      </div>
      <Footer />
    </>
  );
};

export default Forgotpassword;