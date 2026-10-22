import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/assets/logo.svg?react";

export function NotFoundPage() {
    return (
        <div className="flex min-h-full items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
            <section className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-green-50"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-gray-50"
                />

                <div className="relative mx-auto flex max-w-lg flex-col items-center">
                    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-100 bg-green-50 shadow-sm">
                        <LogoIcon className="h-9 w-9" />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                        Vet Konect Admin
                    </p>
                    <p className="mt-3 text-7xl font-bold tracking-tight text-gray-900 sm:text-8xl">
                        404
                    </p>
                    <h1 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        We couldn’t find that page
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                        The page may have moved, or the address might be incorrect.
                        Let’s get you back to a familiar place.
                    </p>

                    <div className="mt-8 flex w-full flex-col justify-center gap-3 min-[420px]:w-auto min-[420px]:flex-row">
                        <Button
                            asChild
                            className="h-11 w-full bg-green-600 px-5 text-white shadow-sm hover:bg-green-700 min-[420px]:w-auto"
                        >
                            <Link to="/">
                                <Home className="mr-2 h-4 w-4" />
                                Go to dashboard
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 w-full border-gray-300 px-5 text-gray-700 hover:bg-gray-50 min-[420px]:w-auto"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go back
                        </Button>
                    </div>

                    <div className="mt-9 flex items-center gap-2 text-xs text-gray-400">
                        <Search className="h-3.5 w-3.5" />
                        <span>If you typed the address, check it and try again.</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
