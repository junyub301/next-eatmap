import { AiOutlineSearch } from "react-icons/ai";
import { DISTRICT_ARR } from "@/data/store";
import { SetStateAction } from "react";

interface SearchFilterProps {
    setQ: React.Dispatch<SetStateAction<string | null>>;
    setDistrict: React.Dispatch<SetStateAction<string | null>>;
}

export default function SearchFilter({ setQ, setDistrict }: SearchFilterProps) {
    return (
        <div className="flex flex-col md:flex-row gap-2 my-4">
            <div className="flex items-center justify-center w-full gap-2">
                <AiOutlineSearch className="w-6 h-6" />
                <input
                    type="search"
                    placeholder="음식점 검색"
                    className="block w-full p-3 text-sm text-gray-800 border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-blue-500 focus:border-2"
                    onChange={(e) => setQ(e.currentTarget.value)}
                />
            </div>
            <select
                onChange={(e) => setDistrict(e.currentTarget.value)}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-sm md:max-w-[200px] rounded-lg focus:border-blue-500 block w-full p-3 outline-none"
            >
                <option value="">지역 선택</option>
                {DISTRICT_ARR.map((val) => (
                    <option value={val} key={val}>
                        {val}
                    </option>
                ))}
            </select>
        </div>
    );
}
