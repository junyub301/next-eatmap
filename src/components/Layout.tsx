import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <Navbar />
            {children}
        </div>
    );
}
