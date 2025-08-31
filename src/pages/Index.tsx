import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BikeGrid from "@/components/BikeGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div id="bikes">
        <BikeGrid />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
