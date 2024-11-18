"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/bottom-navbar";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

export default function SignInPage() {
  const router = useRouter();

  const navigatePage = () => {
    router.push("/sign-up");
  };

  return (
    <>
      {/* Navbar visible only on large screens */}
      <Navbar className="hidden lg:block" />

      {/* Full height container */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex justify-center items-center">
          <div className="w-full max-w-md border border-gray-300 p-6 rounded-2xl shadow-lg">
            <div>
              {/* Added margin-top to add space above Login */}
              <h1 className="text-left text-xl font-semibold mb-3 mt-8">
                Login
              </h1>
              <p className="mb-6">to get started</p>
            </div>
            <SignIn.Root>
              <SignIn.Step name="start">
                {/* Username Field */}
                <Clerk.Field name="identifier">
                  <Clerk.Input asChild>
                    <input
                      type="text"
                      className="bg-stone-100 border border-stone-400 p-2 rounded-md w-full mb-4"
                      placeholder="Username"
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

                <div className="flex gap-2 mb-4 py-4">
                  <p>Don't have an account?</p>
                  <button className="font-bold" onClick={navigatePage}>
                    Register here
                  </button>
                </div>

                {/* Submit Button */}
                <SignIn.Action submit asChild>
                  <button
                    type="submit"
                    className="bg-buttonPrimary text-white p-2 rounded-md w-full mb-16"
                  >
                    Continue
                  </button>
                </SignIn.Action>
              </SignIn.Step>

              {/* Verification Step */}
              <SignIn.Step name="verifications">
                <SignIn.Strategy name="email_code">
                  <Clerk.Field name="code">
                    <Clerk.Label>Code</Clerk.Label>
                    <Clerk.Input asChild>
                      <input
                        type="text"
                        className="bg-stone-100 border border-stone-400 p-2 rounded-md w-full mb-4"
                      />
                    </Clerk.Input>
                    <Clerk.FieldError />
                  </Clerk.Field>
                  <SignIn.Action submit asChild className="">
                    <button
                      type="submit"
                      className="bg-buttonPrimary text-white p-2 rounded-md w-full"
                    >
                      Continue
                    </button>
                  </SignIn.Action>
                </SignIn.Strategy>
              </SignIn.Step>
            </SignIn.Root>
          </div>
        </div>

        {/* BottomNav only visible on small screens */}
        <BottomNav className="lg:hidden" />

        {/* Footer only visible on large screens */}
        <Footer className="hidden lg:block" />
      </div>
    </>
  );
}
