import { useEffect } from "react";
import { useGetQuizResultsByIdQuery } from "../services/quiz";

function QuizResults({ quizId }) {
    const { isLoading, data } = useGetQuizResultsByIdQuery(quizId);
    useEffect(() => {
        console.log(data);
    }, [data])
    return (
        <div className="table-responsive mt-3">

            {isLoading && (
                <div className="text-primary fw-semibold">
                    Loading results...
                </div>
            )}

            {!isLoading && data?.quizResults.length == 0 ?
                <div className="text-primary fw-semibold text-center">No submissions yet</div> : (
                    <table className="table table-bordered table-hover align-middle shadow-sm rounded quiz-table text-center">
                        <thead className="quiz-table-head">
                            <tr>
                                <th className="text-light">Student Name</th>
                                <th className="text-light">Score (Scored / Total)</th>
                                <th className="text-light">Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.quizResults.map((result) => {
                                let currectScore = 0;
                                let totalScore = 0;

                                for (var score in result?.result) {
                                    currectScore += result?.result[score]?.score;
                                    totalScore += result?.result[score]?.correctAnswer?.length;
                                }

                                return (
                                    <tr key={result?._id}>
                                        <td className="fw-medium">
                                            {result?.username}
                                        </td>

                                        <td className="fw-semibold text-primary">
                                            {currectScore}/{totalScore}
                                        </td>

                                        <td className="text-muted small">
                                            {(() => {
                                                const d = new Date(result?.submittedAt);
                                                return d.toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true
                                                });
                                            })()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
        </div>
    );

}

export default QuizResults;