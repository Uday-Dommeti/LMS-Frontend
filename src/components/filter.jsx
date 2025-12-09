import { useEffect, useState } from "react";


function FilterComp({ filQuestions, setFilQuestions }) {
    const categories = ["HTML", "CSS", "JavaScript", "ReactJS"];
    const difficultyLevels = ["Easy", "Medium", "Hard"];
    const [unFilteredQues, setUnFilteredQues] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);

    useEffect(() => {
        setUnFilteredQues(filQuestions);
    }, []);

    function applyFilters(updatedCategories, updatedDifficulties) {
        let filtered = [...unFilteredQues];
        if (updatedCategories.length > 0) {
            filtered = filtered.filter(q => updatedCategories.includes(q.category));
        }

        if (updatedDifficulties.length > 0) {
            filtered = filtered.filter(q => updatedDifficulties.includes(q.difficulty));
        }

        setFilQuestions(filtered);
    }

    function handleCategorySelect(e) {
        let updated;

        if (e.target.checked) {
            updated = [...selectedCategories, e.target.value];
        }
        else {
            updated = selectedCategories.filter((cat) => cat != e.target.value);
        }

        setSelectedCategories(updated);
        applyFilters(updated, selectedDifficulties);
    }

    function handleDifficultySelect(e) {
        let updated;

        if (e.target.checked) {
            updated = [...selectedDifficulties, e.target.value];
        }
        else {
            updated = selectedDifficulties.filter((diff) => diff != e.target.value);
        }

        setSelectedDifficulties(updated);
        applyFilters(selectedCategories, updated);
    }

    function handleClearAll() {
        categories.map((cat) => {
            document.getElementById(cat).checked = false;
        });
        difficultyLevels.map((difficulty) => {
            document.getElementById(difficulty).checked = false;
        })
        setFilQuestions(unFilteredQues);
    }

    return (
        <div className="vh-100 w-25 p-4" style={{ borderLeft: "1px solid coral" }}>
            <h3>Apply Filters</h3>
            <div>
                <h5>Category:</h5>
                {categories.map((cat) => {
                    return <div className="d-flex">
                        <input type="checkbox" name="Category" id={cat} value={cat} onChange={handleCategorySelect} />
                        <label htmlFor={cat} className="mx-2" style={{ cursor: "pointer" }}>{cat}</label>
                    </div>
                })}
            </div>
            <div>
                <h5>Difficulty:</h5>
                {difficultyLevels.map((difficulty) => {
                    return <div className="d-flex">
                        <input type="checkbox" name="difficulty" id={difficulty} value={difficulty} onChange={handleDifficultySelect} />
                        <label htmlFor={difficulty} className="mx-2" style={{ cursor: "pointer" }}>{difficulty}</label>
                    </div>
                })}
            </div>
            <div className="d-flex justify-content-end">
                <button className="btn btn-outline-danger" onClick={handleClearAll}>Clear all</button>
                
            </div>
        </div>
    )
}

export default FilterComp;