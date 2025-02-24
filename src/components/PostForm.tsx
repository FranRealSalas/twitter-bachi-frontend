import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TweetCreation, TweetResponseDTO } from '@/types/tweet';
import { UserResponseDTO } from '@/types/user';
import TweetService from '@/services/TweetService';
import Modal from './modals/Modal';
import UserService from '@/services/UserService';

interface PostFormProps {
    setTweets?: Dispatch<SetStateAction<TweetResponseDTO[] | undefined>>;
}

const PostForm: React.FC<PostFormProps> = ({ setTweets }) => {
    const [imageNum, setImageNum] = useState(0);
    const [loggedUser, setLoggedUser] = useState<UserResponseDTO>();
    const [inputPostContent, setInputPostContent] = useState("");
    const [modalTweetImageOpen, setModalTweetImageOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<TweetCreation>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentImageRef = useRef<HTMLImageElement>(null);
    const [filesAmount, setFilesAmount] = useState(0);

    useEffect(() => {
        UserService.getLoggedUser().then((response) => {
            setLoggedUser(response);
        })
    }, []);

    function handleCreateTweet(e: any) {
        if (e.content.length !== 0) {
            TweetService.createTweets(e.content, fileInputRef.current?.files!).then(() => {
                TweetService.getTweets().then((response) => {
                    if (setTweets) {
                        setTweets(response);
                    }
                    else {
                        location.reload();
                    }
                    reset();
                    setModalTweetImageOpen(false);
                });
            });
        }
    }

    function handleUpdatePostContent(e: any) {
        setInputPostContent(e.target.value);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (fileInputRef.current?.files) {
            setFilesAmount(fileInputRef.current?.files?.length);
            setImageNum(0);
            updateImageSrc(0);
        }
    };

    const handleNextImage = () => {
        if (fileInputRef.current?.files && imageNum < fileInputRef.current?.files.length - 1) {
            setImageNum(prevNum => prevNum + 1);
            updateImageSrc(imageNum + 1);
        }
    };

    const handlePreviousImage = () => {
        if (imageNum > 0) {
            setImageNum(prevNum => prevNum - 1);
            updateImageSrc(imageNum - 1);
        }
    };

    const updateImageSrc = (index: number) => {
        const file = fileInputRef.current?.files?.[index];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const result = reader.result;
                if (result && typeof result === 'string') {
                    currentImageRef.current!.src = (result);
                } else if (result instanceof ArrayBuffer) {
                    const base64String = btoa(
                        new Uint8Array(result).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ''
                        )
                    );
                    currentImageRef.current!.src = (`data:image/jpeg;base64,${base64String}`);
                }
            };

            reader.readAsDataURL(file);
        } else {
            currentImageRef.current!.src = "";
        }
    };

    return (

        <div>
            <form className="flex w-full h-32 border-gray-400 p-5 min-w-fit" onSubmit={handleSubmit(handleCreateTweet)}>
                <div className="flex flex-col w-full gap-3">
                    <div className="flex w-full flex-row justify-between items-center gap-2">
                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${loggedUser?.profilePhoto}`} onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"} className="w-14 h-14 rounded-full" />
                        <input type="text"
                            className="h-full w-full p-2 bg-black outline-none"
                            placeholder="Que esta pasando?!"
                            {...register("content")}
                            onChange={handleUpdatePostContent}
                        />
                    </div>
                    <div className="flex justify-between h-full">
                        <div className="flex gap-5">

                            <Modal open={modalTweetImageOpen} setOpen={setModalTweetImageOpen}>
                                <div className="absolute bg-black p-2 rounded-xl border">
                                    <input multiple {...register("images")} type="file" onChange={handleFileChange} ref={fileInputRef} />
                                    <div className='flex justify-center items-center'>
                                        <div>
                                            <div className='w-full justify-between flex'>
                                                <button
                                                    onClick={handlePreviousImage}
                                                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-500 p-2 rounded-full ${fileInputRef.current?.files ? filesAmount > 1 ? "block" : "hidden" : "hidden"}`}>
                                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5">
                                                        <g>
                                                            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                                        </g>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={handleNextImage}
                                                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-500 p-2 rounded-full ${fileInputRef.current?.files ? filesAmount > 1 ? "block" : "hidden" : "hidden"}`}
                                                >
                                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5">
                                                        <g>
                                                            <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                className={`${fileInputRef.current?.files ? filesAmount > 0 ? "block" : "hidden" : "hidden"}`}
                                                onClick={() => {
                                                    const dt = new DataTransfer;

                                                    if (fileInputRef.current!.files) {
                                                        for (let i = 0; i < fileInputRef.current!.files.length; i++) {
                                                            const file = fileInputRef.current!.files[i];
                                                            if (imageNum !== i) {
                                                                dt.items.add(file);
                                                            }
                                                        }
                                                        if (imageNum === fileInputRef.current?.files.length! - 1) {
                                                            updateImageSrc(imageNum - 1);
                                                            setImageNum(imageNum - 1);
                                                        }
                                                        else {
                                                            setImageNum(imageNum);
                                                            updateImageSrc(imageNum + 1);
                                                        }
                                                    }

                                                    fileInputRef.current!.files = dt.files;
                                                    setFilesAmount(dt.files.length);
                                                }}
                                            >Borrar</button>
                                            <img className={`w-40 h-40 rounded-xl ${fileInputRef.current?.files ? filesAmount > 0 ? "block" : "hidden" : "hidden"}`} ref={currentImageRef} />
                                        </div>
                                    </div>
                                </div>
                            </Modal>

                            <button type="button" onClick={(e) => {
                                setTimeout(() => {
                                    setModalTweetImageOpen(!modalTweetImageOpen)
                                }, 100);
                                }}>
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white hover:bg-gray-400 rounded"><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g></svg>
                            </button>
                            <button>
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white hover:bg-gray-400 rounded"><g><path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path></g></svg>
                            </button>

                        </div>
                        <div>
                            <button type="submit" className={`rounded-xl w-[75px] h-[30px] ${inputPostContent.length === 0 ? 'bg-gray-500' : 'bg-sky-500'}`} disabled={inputPostContent.length === 0}>Postear</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default PostForm;