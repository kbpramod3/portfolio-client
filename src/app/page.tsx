import PortfolioTable from "../components/PortfolioTable";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Home() {
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen pb-5 gap-16">
      <Header />
      <main className="flex-1 p-6">
        <PortfolioTable />
      </main> 
      <Footer />
    </div>
  );
}
