"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/bottom-navbar";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

export default function SignUpPage() {
  const router = useRouter();

  // Navigate to the sign-in page
  const navigatePage = (event) => {
    event.preventDefault();
    router.push("/sign-in");
  };

  return (
    <>
      <Navbar className="hidden lg:block" />

      {/* Full height container */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex justify-center items-center">
          <div className="w-full max-w-md border border-gray-300 p-6 rounded-2xl shadow-lg">
            <div>
              {/* Sign-Up Header */}
              <h1 className="text-left text-xl font-semibold mb-3 mt-8">
                Signup
              </h1>
              <p className="mb-6">to get started</p>
            </div>

            {/* SignUp Component */}
            <SignUp.Root>
              {/* Initial SignUp Step */}
              <SignUp.Step name="start">
                {/* Username Field */}
                <Clerk.Field name="username">
                  <Clerk.Input asChild>
                    <input
                      type="text"
                      className="bg-stone-100 border border-stone-400 p-2 rounded-md w-full mb-4"
                      placeholder="Username"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>

                {/* Email Field */}
                <Clerk.Field name="emailAddress">
                  <Clerk.Input asChild>
                    <input
                      type="email"
                      className="bg-stone-100 border border-stone-400 p-2 rounded-md w-full mb-4"
                      placeholder="Email"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>

                {/* Password Field */}
                <Clerk.Field name="password">
                  <Clerk.Input asChild>
                    <input
                      type="password"
                      className="bg-stone-100 border border-stone-400 p-2 rounded-md w-full mb-4"
                      placeholder="Password"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>

                {/* Confirm Password Field */}
                <Clerk.Field name="confirmPassword">
                  <Clerk.Input asChild>
                    <input
                      type="password"
                      className="bg-stone-100 border border-stone-400 p-2 rounded-md w-full mb-4"
                      placeholder="Confirm Password"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError />
                </Clerk.Field>

                {/* Submit Button for Sign Up */}
                <SignUp.Action
                  submit
                  className="bg-buttonPrimary text-white p-2 rounded-md w-full"
                >
                  Continue
                </SignUp.Action>

                {/* Redirect to Sign In if already have an account */}
                <div className="flex gap-2 mb-4 py-4 justify-center">
                  <p>Already registered?</p>
                  <button className="font-bold" onClick={navigatePage}>
                    Login
                  </button>
                </div>
              </SignUp.Step>
            </SignUp.Root>
          </div>
        </div>

        {/* BottomNav only visible on small screens */}
        <BottomNav className="lg:hidden" />

        {/* Footer visible only on large screens */}
        <Footer className="hidden lg:block" />
      </div>
    </>
  );
}
