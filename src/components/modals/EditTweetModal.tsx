import { useOutsideAlerter } from "@/utils/outsideAlerter";
import { Dispatch, ReactNode, SetStateAction, useRef } from "react";

function EditModal({ children, open, setModalOpen }: { children: ReactNode, open: boolean, setModalOpen: Dispatch<SetStateAction<boolean>> }) {
    const modalRef = useRef(null);
    useOutsideAlerter(modalRef, setModalOpen);

    return (
        <>
            {open ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative w-3/6 rounded-xl shadow-lg bg-black p-4 border border-gray-400" ref={modalRef}>
                        {children}
                    </div>
                </div>
                : <></>
            }
        </>
    )
}

export default EditModal;