import Footer from "../_components/Footer"
import { Header } from "./_components/Header"

interface MarketingLayoutProps {
  children: React.ReactNode
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default MarketingLayout
