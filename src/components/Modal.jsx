import QuestionForm from "./QuestionForm";


function Modal(props) {
    // let mbody = modalBody;
    return (
        <div class="modal-dialog modal-lg my-0 modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">{props.header}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {props.children}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    {/* <button type='button' className='btn btn-primary' data-bs-dismiss="modal">Ok</button> */}
                    {/* <button type="button" class="btn btn-primary">Understood</button> */}
                </div>
            </div>
        </div>
    )
}

export default Modal;