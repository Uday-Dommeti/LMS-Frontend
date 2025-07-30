import React, { useEffect, useState } from "react";
import "./quiz.css";

import { quiz } from "./quizSlice";

function QuizApp() {
  // const [quizDetails, setQuizDetails] = useState([]);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [quesIndex, setQuesIndex] = useState(0);

  useEffect(() => {
    // fetch("https://opentdb.com/api.php?amount=10")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("datadata", data.results);
    //     setQuizDetails(data.results);
    //   });
    console.log(quesIndex);
  }, [quesIndex]);

  const shuffle = (a) => {
    var answers = [...a?.incorrect_answers, a?.correct_answer];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  };

  return (
    <div className={buttonFlag ? "px-5 py-4" : "p-5"}>
      <div className="d-flex justify-content-end gap-3">
        <button
          onClick={() => setButtonFlag(!buttonFlag)}
          // disabled={!buttonFlag}
          className="btn btn-primary fw-bolder"
        >
          {buttonFlag ? "one at a time" : "view all at once"}
        </button>
      </div>
      <form
        action=""
        className="m-5"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form submitted");
        }}
      >
        <ol className={buttonFlag || "ps-0"}>
          {buttonFlag ? (
            quiz.map((el, i) => {
              return (
                <li key={i}>
                  <h5>{el?.question}</h5>
                  {el &&
                    shuffle(el).map((ans, j) => {
                      return (
                        <div key={j} className="d-flex align-items-center ms-4">
                          <label className="d-flex gap-2">
                            <input
                              type="radio"
                              name={el?.question}
                              value={ans}
                            />
                            {ans}
                          </label>
                        </div>
                      );
                    })}
                </li>
              );
            })
          ) : (
            <li className="d-flex flex-column gap-2 mb-5">
              <h5>{quesIndex + 1 + ") " + quiz[quesIndex]?.question}</h5>
              {shuffle(quiz[quesIndex]).map((ans, j) => {
                return (
                  <div key={j} className="d-flex align-items-center ms-4">
                    <label className="d-flex gap-2">
                      <input
                        type="radio"
                        name={quiz[quesIndex]?.question}
                        value={ans}
                      />
                      {ans}
                    </label>
                  </div>
                );
              })}
            </li>
          )}
          <div className="d-flex justify-content-between">
            {!buttonFlag && (
              <div className="d-flex justify-content-between w-100">
                <button
                  type="button"
                  disabled={quesIndex === 0}
                  onClick={() => {
                    console.log("lsls", quesIndex);

                    setQuesIndex(quesIndex - 1);
                  }}
                  className="btn btn-secondary"
                >
                  Previous Question
                </button>
                {quesIndex < quiz.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuesIndex(quesIndex + 1);
                    }}
                    className="btn btn-info"
                  >
                    Next Question
                  </button>
                )}
              </div>
            )}
            {(quesIndex === quiz.length - 1 || buttonFlag) && (
              <div className="w-100">
                <button className="btn btn-success float-end">Submit</button>
              </div>
            )}
          </div>
        </ol>
      </form>
    </div>
  );
}

export default QuizApp;
