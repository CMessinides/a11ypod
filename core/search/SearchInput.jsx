import React from "react";
import PropTypes from "prop-types";
import { Search } from "react-feather";

function SearchInput({
	id,
	value,
	placeholder = "Search",
	label = "Search",
	onChange = () => {}
}) {
	return (
		<div className="relative">
			<label htmlFor={id} className="sr-only">
				{label}
			</label>
			<Search
				size={20}
				className="absolute text-gray-500 pointer-events-none"
				style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }}
			></Search>
			<input
				id={id}
				type="text"
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				className="block bg-gray-300 placeholder-gray-500 text-gray-700 rounded-lg px-3 py-2 w-full"
				style={{ paddingLeft: "48px" }}
			/>
		</div>
	);
}

SearchInput.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string
};

export default SearchInput;
