import { useGetQuestionByIdQuery } from "../services/technology";
import parse from "html-react-parser";

function QuestionPrompt({ id }) {
    const { isLoading, data } = useGetQuestionByIdQuery(id);
    
    return (
        <div>
            <i className="d-flex flex-wrap question-pr">{data &&
                parse(data?.requestedQuestion?.question)
            }
            </i>
        </div>
    )
}

export default QuestionPrompt;