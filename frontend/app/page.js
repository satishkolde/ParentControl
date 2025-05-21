// app/page.js
import Link from "next/link";
import IndexNavbar from "./Navbars/IndexNavbar";
import Footer from "./Footer/Footer";
export default function LandingPage() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-md text-blueGray-600">
                ರಕ್ಷಕX<sup>+</sup>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                AI-Based Parental Control System Using Keystroke Monitoring and
                Real-Time Risk Detection
                <a
                  href="https://tailwindcss.com/?ref=creativetim"
                  className="text-blueGray-600"
                  target="_blank"
                ></a>
              </p>
              <div className="mt-12">
                <Link
                  href="/register"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  className="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-14/12 max-h-800px"
          src="https://sdmntprwestus.oaiusercontent.com/files/00000000-ee28-6230-8cfd-5add249a5179/raw?se=2025-05-21T19%3A56%3A44Z&sp=r&sv=2024-08-04&sr=b&scid=9d9592c7-4ce2-50de-a284-e55b28cf850c&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-20T22%3A33%3A22Z&ske=2025-05-21T22%3A33%3A22Z&sks=b&skv=2024-08-04&sig=SSYL8Ue39RAxJJoYygMYzcyhHUrAQY%2BYwIWuZeKXAoM%3D"
          alt="..."
        />
      </section>

      <section className="pb-16 bg-blueGray-200 relative pt-32">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <Footer />
    </>
  );
}
