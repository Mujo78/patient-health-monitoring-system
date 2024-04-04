import { CustomFlowbiteTheme, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import CustomButton from "../UI/CustomButton";
import { useQuery } from "../../hooks/useQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { categories } from "../../validations/pharmacyValidation";

const customTextInputTheme: CustomFlowbiteTheme["textInput"] = {
  field: {
    input: {
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2.5 text-sm xxl:!text-xl xxl:!p-3",
        lg: "sm:text-md p-4",
      },
    },
  },
};

const customSelectTheme: CustomFlowbiteTheme["select"] = {
  field: {
    select: {
      sizes: {
        md: "p-2.5 text-sm xxl:!text-lg xxl:!p-3",
      },
    },
  },
};

const MedicineSearchHeader = () => {
  const [search, setSearch] = useState<string>("");
  const location = useLocation().pathname;
  const query = useQuery();
  const searchQuery = query.get("searchQuery") || "";
  const category = query.get("category") || "";
  const navigate = useNavigate();
  const [categorySearch, setCategorySearch] = useState<string>(category || "");

  const handleClickSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.get("id")) {
      query.delete("id");
    }

    if (search !== "" && search !== searchQuery) {
      query.set("page", "1");
      query.set("searchQuery", search);

      navigate(`${location}?${query.toString()}`);
    }
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategorySearch(e.target.value);
    if (query.get("id")) {
      query.delete("id");
    }
    query.set("category", e.target.value);
    navigate(`${location}?${query.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    navigate(`${location}?page=1`);
  };

  return (
    <>
      <form onSubmit={handleClickSearch}>
        <div className="my-4 flex items-center justify-center gap-3 lg:!mx-auto lg:w-3/4">
          <TextInput
            theme={customTextInputTheme}
            sizing="md"
            className="w-full lg:w-3/4 xxl:!text-2xl"
            placeholder="Amoxicilline, Prozac"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <CustomButton type="submit" disabled={search === ""} size="md">
            <p className="xxl:text-xl">Search</p>
          </CustomButton>
        </div>
      </form>
      {searchQuery !== "" && (
        <div className="flex items-center justify-between">
          <Select
            sizing="md"
            theme={customSelectTheme}
            value={categorySearch}
            name="category"
            onChange={(e) => handleChangeCategory(e)}
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <span
            onClick={clearSearch}
            className="cursor-pointer  text-sm text-red-500 hover:underline md:mr-1.5 xxl:!text-2xl"
          >
            Clear
          </span>
        </div>
      )}
    </>
  );
};

export default MedicineSearchHeader;
