import { Geist, Inter, Montserrat, Poppins } from "next/font/google";

const montserrat = Poppins({
  variable: "--font-poppin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export { montserrat };
