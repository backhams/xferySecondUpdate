"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BiMenu } from "react-icons/bi";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/app/Redux/toggleSlice";
import SideBar from "@/app/components/SideBar";
import { BiArrowBack } from "react-icons/bi";
import {
  FaCartPlus,
} from "react-icons/fa6";
import { Vortex } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "@/app/components/Toast";

export default function Trending() {
  const { systemTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [responseData, setResponseData] = useState(null);
  const [menuToggle, setMenuToggle] = useState(true);
  const api = process.env.NEXT_PUBLIC_SERVER_API;

  const toggle = () => {
    setMenuToggle(!menuToggle);
    dispatch(toggleSidebar());
  };
  const removeCart = async (pid) => {
    const userEmail = await session.user.email;
    const response = await fetch(
      `${api}/removecart?pid=${pid}&email=${userEmail}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    if (response.status === 200) {
      showSuccessToast(responseData);
    } else if (response.status === 404) {
      showWarningToast(responseData);
    } else {
      showErrorToast(responseData);
    }
  };

  const productDetail = async (pid) => {
    if (pid) {
      router.push(`/productDetails?productId=${pid}`);
    }
  };
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Authenticate");
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${api}/getCartProduct?email=${session.user.email}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          console.log(data)
          setResponseData(data);
          if (response.status === 500) {
            showErrorToast(data);
          }
        } catch (error) {
          
        }
      };

      fetchData();
    }
  }, [status]);

  
  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <div
        className={`flex justify-between items-center shadow-md py-3 md:py-5 px-2 pr-7 z-40 fixed ${
          systemTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
        } w-full top-0 md:pr-16`}
      >
        <div className={"flex justify-center items-center"}>
          <BiMenu
            onClick={toggle}
            className="hidden mr-10 cursor-pointer md:block"
            size={30}
          />
          <button className="px-5 py-2" onClick={handleGoBack}>
            <BiArrowBack size={25} />
          </button>
          <h1 className="font-semibold">Your Saved Item {responseData ? responseData.length : 0}</h1>
        </div>
        <div className="hidden md:block w-full ml-9">
          <Link href={"/addtocard"} className="bg-searchbox text-white py-2 rounded-xl px-5 text-sm">Regular Item</Link>
          <button  className="bg-blue-500 text-white ml-7 rounded-xl py-2 px-5 text-sm" >Trending Item</button>
        </div>
        <Link href="/addtocard" className="hidden md:block cursor-pointer">
          <FaCartPlus size={30} />
        </Link>
      </div>
      <SideBar/>
      <div className="md:hidden ml-3 flex mt-14 fixed bg-white z-10 w-full pt-7 pb-5">
        <Link  href={"/addtocard"} className="bg-searchbox text-white py-2 rounded-xl px-5 text-xs">Regular </Link>
          <button className="bg-blue-500 text-white rounded-xl py-2 ml-5 px-5 text-xs">Trending</button>
        </div>
      <div className="flex justify-center h-screen overflow-auto">
        <div className={`flex flex-col items-center mt-36 ${
              menuToggle ? "md:ml-64 duration-300" : "duration-200"}`}>
          <div className="xl:w-2/4 lg:w-3/4">
            {responseData ? (
              Array.isArray(responseData) && responseData.length > 0 ? (
                // Map through responseData and render each product as a card
                responseData.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => productDetail(product.productId)}
                    className="border-gray-300 hover:cursor-pointer rounded-lg p-4 shadow-md flex items-center mb-4"
                  >
                    {/* Image (you can add an <img> tag here) */}
                    <div>
                      <div className="w-28 h-28 bg-gray-200 mr-4 relative">
                        {/* Add your image here */}
                        <img
                          src={product.productImage}
                          alt=""
                          className="w-full h-full object-cover object-center"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="flex-grow">
                      <p className="text-xl font-semibold line-clamp-2">
                        {product.productName}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">
                            {/* Price: ${adjustPrice(product.productPrice)} */}
                            Saved
                          </p>
                        </div>
                        {/* Buy Now Button */}
                        <div>
                          <button
                            onClick={(e) => {
                               e.stopPropagation(); // This prevents the click event from propagating
                              removeCart(product.productId); // Call removeCart after stopping propagation
                            }}
                            className="bg-black text-white px-4 py-2 rounded"
                          >
                            remove cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-gray-300 rounded-lg p-4 shadow-md">
                  <p>Your cart is empty</p>
                </div>
              )
            ) : (
              // Render loading state while waiting for data
              <div>
                <Vortex
                  visible={true}
                  height={60}
                  width={60}
                  ariaLabel="vortex-loading"
                  wrapperStyle={{}}
                  wrapperClass="vortex-wrapper"
                  colors={["gray", "black", "gray", "black", "gray", "black"]}
                />
                <h5>Cart...</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
