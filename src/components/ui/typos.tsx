import React from "react";

export const H1 = ({ children }: { children: React.ReactNode }) => {
    return <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{children}</h1>;
};

export const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <h2
            className={
                "mb-2 scroll-m-20 border-b text-3xl font-semibold tracking-tight text-accent first:mt-0 " + className
            }
        >
            {children}
        </h2>
    );
};

export const H3 = ({ children }: { children: React.ReactNode }) => {
    return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>;
};

export const H4 = ({ children }: { children: React.ReactNode }) => {
    return <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">{children}</h3>;
};
