import Form from "next/form";
import { Search } from "lucide-react";
import SearchFormReset from "./SearchFormReset";

const PageHeaderSearchForm = ({ query }: { query: string }) => {
  return (
    <Form
      id="search-form"
      action="/all-listings"
      scroll={false}
      className="flex items-center gap-2.5 w-3/4 justify-center"
    >
      <input
        name="query"
        defaultValue={query}
        className="border border-slate-600 bg-slate-600 px-2 py-1 text-white text-[1rem] outline-none focus:outline-none placeholder:text-white  placeholder:text-[0.85rem]"
        placeholder="Search for more listings"
      />
      <div className="flex items-end gap-2">
        {query && <SearchFormReset />}

        <button type="submit" title="Search" aria-label="Search Input">
          <Search className="w-8 h-8 p-1.5 text-white bg-slate-600 border border-slate-900" />
        </button>
      </div>
    </Form>
  );
};

export default PageHeaderSearchForm;
