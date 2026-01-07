'use client';
import {Button} from "@nextui-org/button";
import { Search } from "lucide-react";

interface SearchButtonProps {
  onSearch: () => void;
}

const SearchButton = ({onSearch}:SearchButtonProps) => {
  return (
    <Button
      onClick={onSearch}
      className="w-full h-14 text-sm sm:text-base font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
      startContent={<Search className="w-4 h-4 sm:w-5 sm:h-5" />}
    >
      Search
    </Button>
  );
};

export default SearchButton;