import Link from "next/link";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div className="navbar">
            <Link href="/" className="navbar__logo">
                next_eatmap
            </Link>
            <div className="navbar__list">
                <Link href="/stores" className="navbar__list--item">
                    맛집 목록
                </Link>
                <Link href="/stores/new" className="navbar__list--item">
                    맛집 등록
                </Link>
                <Link href="/users/likes" className="navbar__list--item">
                    찜한 가게
                </Link>
                <Link href="/api/auth/signin" className="navbar__list--item">
                    로그인
                </Link>
            </div>
            <div
                className="navbar__button"
                role="presentation"
                onClick={() => setIsOpen((pre) => !pre)}
            >
                {isOpen ? <AiOutlineClose /> : <BiMenu />}
            </div>
            {isOpen && (
                <div className="navbar--mobile">
                    <div className="navbar__list--mobile">
                        <Link href="/stores" className="navbar__list--item--mobile">
                            맛집 목록
                        </Link>
                        <Link href="/stores/new" className="navbar__list--item--mobile">
                            맛집 등록
                        </Link>
                        <Link href="/users/likes" className="navbar__list--item--mobile">
                            찜한 가게
                        </Link>
                        <Link href="/api/auth/signin" className="navbar__list--item--mobile">
                            로그인
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
