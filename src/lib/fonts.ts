import localFont from "next/font/local"

export const fontSans = localFont({
  src: [
    {
      path: "./fonts/IRANSansX-Thin.woff",
      weight: "100",
    },
    {
      path: "./fonts/IRANSansX-UltraLight.woff",
      weight: "200",
    },
    {
      path: "./fonts/IRANSansX-Light.woff",
      weight: "300",
    },
    {
      path: "./fonts/IRANSansX-Regular.woff",
      weight: "400",
    },
    {
      path: "./fonts/IRANSansX-Medium.woff",
      weight: "500",
    },
    {
      path: "./fonts/IRANSansX-DemiBold.woff",
      weight: "600",
    },
    {
      path: "./fonts/IRANSansX-Bold.woff",
      weight: "700",
    },
    {
      path: "./fonts/IRANSansX-ExtraBold.woff",
      weight: "800",
    },
    {
      path: "./fonts/IRANSansX-Black.woff",
      weight: "900",
    },
    {
      path: "./fonts/IRANSansX-ExtraBlack.woff",
      weight: "1000",
    },
  ],
  variable: "--font-ir-sans",
})
