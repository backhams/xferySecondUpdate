"use client";
import React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdVerified } from "react-icons/md";
import { FcPaid } from "react-icons/fc";
import { LuLogOut, LuHelpCircle } from "react-icons/lu";
import { FaMapLocationDot, FaNewspaper } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { BiSolidShoppingBags, BiSupport } from "react-icons/bi";

export default function Model({ isVisible, onClose }) {
  const { data: session, status } = useSession();
  const { systemTheme } = useTheme();
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };
  const logout = async () => {
    try {
      await localStorage.removeItem("jwt");
      await signOut("google");
    } catch (error) {
      showErrorToast("An error occurred during navigation:");
    }
  };

  return (
    <>
      <div
        className="fixed h-screen w-screen z-10  inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
        id="wrapper"
        onClick={handleClose}
      >
        <div className="w-64 flex flex-col">
          <div className="bg-white h-screen px-4 md:px-7">
            <button
              className="text-xl place-self-end"
              onClick={() => onClose()}
            >
              X
            </button>
            <div className="overflow-y-auto custom-scrollbar h-screen">
            <div className="flex justify-center items-center mt-5 font-bold">
              <h1
                className={`${
                  systemTheme === "dark" ? "text-black" : "text-black"
                }`}
              >
                Xfery.com
              </h1>
            </div>
            <div>
              <div className="flex justify-center items-center">
                {status === "unauthenticated" ? (
                  <button className="bg-searchbox rounded-md text-white px-5 py-1">
                    Signin/signup
                  </button>
                ) : (
                  <div>
                    <div className="flex justify-center">
                      <img
                        className="rounded-full h-12 w-12"
                        src={session?.user?.image}
                        alt="profile"
                      />
                    </div>
                    <div className=" mt-5 text-md flex justify-center items-center">
                      <h3 className="pl-3">@{session?.user?.name}</h3>
                      <MdVerified size={17} color="blue" className="ml-1" />
                    </div>
                    <div className=" mt-2 text-sm border-b-2 pb-7 mb-5">
                      <h3 className="pl-3">{session?.user?.email}</h3>
                    </div>
                    <div className="flex mb-5">
              <FcPaid size={20} />
              <Link href={"/paid/product/item"}>
                <p className="pl-3">Paid item</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <BiSolidShoppingBags size={20} />
              <Link href={"/orders-item"}>
              <p className="pl-3">Orders</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <FaMapLocationDot size={20} />
              <Link href={"/savedAddress"}>
              <p className="pl-3">Address</p>
              </Link>
            </div>
            <div className=" flex mb-5">
              <BiSupport size={20} />
              <Link href={"/contact-us"}>
              <p className="pl-3">Contact us</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <LuHelpCircle size={20} />
              <Link href={"/getHelp"}>
              <p className="pl-3">Get help</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <FaNewspaper size={20} />
              <Link href={"/Terms&Condition"}>
                <p className="pl-3">Terms of use</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <MdFeedback size={20} />
              <Link href={"/feedback"}>
                <p className="pl-3">Feedback</p>
              </Link>
            </div>
            <div className="flex">
              <LuLogOut size={20} />
              <p onClick={logout} className="pl-3 hover:cursor-pointer">
                Logout
              </p>
            </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 font-semibold">
              <h1
                className={`${
                  systemTheme === "dark" ? "text-black" : "text-black"
                }`}
              >
                Search by
              </h1>
            </div>
            <div className="flex flex-wrap justify-start pb-7 md:pb-20 mt-9 gap-y-5 gap-x-5 md:gap-x-7">
              <Link href={"/"}>Women's Clothing</Link>
              <Link href={"/"}>Men's Clothing</Link>
              <Link href={"/"}>Electronic</Link>
              <Link href={"/"}>Shoes</Link>
              <Link href={"/"}>T-shirt</Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
