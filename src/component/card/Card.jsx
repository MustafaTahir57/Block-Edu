import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import study from "../../assets/create_lesson.jpeg";
import {
  cryptoIsFunAbi,
  cryptoIsFunAddress,
} from "../../utils/contract/cryptoIsFun";
import Spinner from "react-bootstrap/Spinner";
import { Modal, Table } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { IoMdClose } from "react-icons/io";
import ReactPaginate from "react-paginate";
const Card = ({ connectWallets }) => {
  const [content, setContent] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessonDetails, setLessonDetails] = useState([]);
  const [singleDetails, setSingleDetails] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [lessonCreateLoading, setLeassonCreateLoading] = useState(false);
  const [lessonCreateError, setLeassonCreateError] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [owner, setOwner] = useState();
  const [text, setText] = useState();
  const [bnbPrice, setBNBPrice] = useState("");
  const [fundLessonError, setFundLessonError] = useState(false);
  const [fundLessonLoading, setfundLessonLoading] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [showRating, setShowRating] = useState(0);
  const handleHide = () => {
    setModalShow(false);
    setError(false);
    setLoading(false);
    setLeassonCreateLoading(false);
    setLeassonCreateError(false);
    setRefundLoading(false);
    setText("");
    setBNBPrice("");
    setFundLessonError(false);
    setfundLessonLoading(false);
  };
  const integrateContract = () => {
    const web3 = window.web3;
    const minting_Contract = new web3.eth.Contract(
      cryptoIsFunAbi,
      cryptoIsFunAddress
    );
    return minting_Contract;
  };
  const handleSubmit = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first");
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect network");
      } else {
        if (!content || !takeaway || !price || !quota) {
          setError(true);
          return;
        }
        setLoading(true);
        const web3 = window.web3;
        const weiPrice = web3.utils.toWei(price, "ether");
        const weiQuota = web3.utils.toWei(quota, "ether");
        let contract = integrateContract();
        const createLesson = await contract.methods
          .createLesson(content, takeaway, weiPrice, weiQuota)
          .send({
            from: connectWallets,
          });
        if (createLesson) {
          toast.success("Lesson Created successfully.");
          getDetails();
          setContent("");
          setTakeaway("");
          setPrice("");
          setQuota("");
        }
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setLoading(false);
    }
  };

  const getDetails = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
      } else if (connectWallets == "Wrong Network") {
      } else {
        setTableLoading(true);
        const web3 = window.web3;
        let contract = integrateContract();
        const owner = await contract.methods.owner().call();
        setOwner(owner);
        let array = [];
        let lessonCount = await contract.methods.lessonCount().call();
        for (let i = 1; i <= Number(lessonCount); i++) {
          const getLessonDetails = await contract.methods
            .getLessonDetails(i)
            .call();
          let price = web3.utils.fromWei(
            Number(getLessonDetails.price),
            "ether"
          );
          let quota = web3.utils.fromWei(
            Number(getLessonDetails.quota),
            "ether"
          );
          let fundss = web3.utils.fromWei(
            Number(getLessonDetails.funds),
            "ether"
          );

          const unixTimestampMilliseconds =
            Number(getLessonDetails.fundingEndTime) * 1000;
          const dateObject = new Date(unixTimestampMilliseconds);
          const year = dateObject.getFullYear();
          const month = String(dateObject.getMonth() + 1).padStart(2, "0");
          const day = String(dateObject.getDate()).padStart(2, "0");
          let hours = String(dateObject.getHours()).padStart(2, "0");
          const minutes = String(dateObject.getMinutes()).padStart(2, "0");
          const seconds = String(dateObject.getSeconds()).padStart(2, "0");
          const amPm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${amPm}`;
          const object = {
            content: getLessonDetails.content,
            takeaway: getLessonDetails.takeaway,
            rating: Number(getLessonDetails.rating),
            issuer: getLessonDetails.issuer,
            completed: getLessonDetails.completed,
            fundingEndTime: formattedDateTime,
            prices: Number(price),
            quotas: Number(quota),
            funds: fundss,
            id: Number(getLessonDetails.id),
            endTime: getLessonDetails.fundingEndTime,
          };
          array.push(object);
        }
        setLessonDetails(array);
        setTableLoading(false);
      }
    } catch (e) {
      console.log("e", e);
      setTableLoading(false);
    }
  };
  const handleDetails = (item) => {
    setModalShow(true);
    setSingleDetails(item);
    setShowRating(item?.rating);
  };

  const handleRating = (rate) => {
    setLeassonCreateError(false);
    setRating(rate);
  };

  const handleCompleteLesson = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first");
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect network");
      } else {
        if (rating <= 0) {
          setLeassonCreateError(true);
          return;
        }
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        if (currentTimeStamp > singleDetails.endTime) {
          setLeassonCreateError(false);
          setLeassonCreateLoading(true);
          let contract = integrateContract();
          const completeLesson = await contract.methods
            .completeLesson(singleDetails.id, rating)
            .send({
              from: connectWallets,
            });
          if (completeLesson) {
            toast.success("Lesson Completed successfully");
            setRating(0);
          }
        } else {
          toast.error("Currently unavailable to complete the lesson.");
        }
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setLeassonCreateLoading(false);
    }
  };
  const handleRefund = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first");
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect network");
      } else {
        let contract = integrateContract();
        const getLessonCompletionStatus = await contract.methods
          .getLessonCompletionStatus(singleDetails.id)
          .call();
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        if (
          currentTimeStamp > singleDetails.endTime &&
          !getLessonCompletionStatus
        ) {
          setRefundLoading(true);
          const refund = await contract.methods.refund(singleDetails.id).send({
            from: connectWallets,
          });
          if (refund) {
            toast.success("Refund get successfuly.");
          }
        } else {
          toast.error("Currently unavailable for refund");
        }
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setRefundLoading(false);
    }
  };
  const handleFundLesson = async () => {
    try {
      if (connectWallets == "Connect Wallet") {
        toast.error("Please Connect wallet first");
      } else if (connectWallets == "Wrong Network") {
        toast.error("Please Connect network");
      } else {
        let contract = integrateContract();
        if (bnbPrice < singleDetails.prices) {
          setFundLessonError(true);
          return;
        }
        setfundLessonLoading(true);
        setFundLessonError(false);
        const web3 = window.web3;
        let price = web3.utils.toWei(bnbPrice.toString(), "ether");
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        if (currentTimeStamp < singleDetails.endTime) {
        console.log("singleDetails.id", price);
        const fundLesson = await contract.methods
          .fundLesson(singleDetails.id)
          .send({ from: connectWallets, value: price});
        if (fundLesson) {
          toast.success("Lesson fund get successfully");
        }
        } else {
          toast.error("Your time limit has been exceeded.");
        }
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setfundLessonLoading(false);
    }
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lessonDetails.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    getDetails();
  }, [connectWallets]);
  return (
    <div>
      <div className="container">
        <div className="row mt-5 pb-5">
          <div className="col-md-6 d-flex align-items-center">
            <img src={study} alt="study" className="study-img img-fluid" />
          </div>
          <div className="col-md-6 d-flex align-items-start flex-column mt-2">
            <h4 className="education-span text-center">Create Lesson</h4>
            <input
              type="text"
              placeholder="Enter Content"
              className="number-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && !content && (
              <span className="error-message text-start">
                Content is required{" "}
              </span>
            )}
            <input
              type="number"
              placeholder="Enter Price"
              className="number-input"
              value={price}
              min={1}
              onChange={(e) => setPrice(e.target.value)}
            />
            {error && !content && (
              <span className="error-message text-start">
                Price must be a positive number
              </span>
            )}
            <input
              type="number"
              placeholder="Enter quota"
              className="number-input"
              value={quota}
              min={1}
              onChange={(e) => setQuota(e.target.value)}
            />
            {error && !content && (
              <span className="error-message text-start">
                Quota must be a positive number
              </span>
            )}
             <textarea
              type="text"
              placeholder="Enter takeaway"
              className="number-input-area"
              rows="3"
              value={takeaway}
              onChange={(e) => setTakeaway(e.target.value)}
            />
            {error && !content && (
              <span className="error-message text-start">
                Takeaway is required{" "}
              </span>
            )}
            <div className="row">
              <div className="col-md-6 mt-4">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-create"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Loading...</span>
                      </div>
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center mt-5 pb-5">
          <div className="col-md-10">
            <h4 className="education-span text-center  mb-5">Lesson</h4>
            <Table striped className="table-home">
              <thead>
                <tr>
                  <th className="table-home">Sr.</th>
                  <th className="table-home">Lesson</th>
                  <th className="table-home text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {connectWallets != "Connect Wallet" &&
                connectWallets != "Wrong Network" ? (
                  <>
                    {!tableLoading ? (
                      <>
                        {currentItems?.length > 0 ? (
                          currentItems?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.content}</td>
                                <td className="text-center">
                                  <button
                                    className="btn btn-details"
                                    onClick={() => handleDetails(item)}
                                  >
                                    See Details
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr
                            className="pt-5 text-center"
                            style={{ height: "200px" }}
                          >
                            <td colSpan={3} style={{ paddingTop: "80px" }}>
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr
                        className="pt-5 text-center"
                        style={{ height: "200px" }}
                      >
                        <td colSpan={3} style={{ paddingTop: "80px" }}>
                          <Spinner />
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr className="pt-5 text-center" style={{ height: "200px" }}>
                    <td colSpan={3} style={{ paddingTop: "80px" }}>
                      Connect MetaMask
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="pagination-container">
              {lessonDetails.length > 10 && (
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={Math.ceil(lessonDetails.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {modalShow ? (
        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ backgroundColor: "#353f53", color: "white" }}>
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="modal-body d-flex justify-content-between align-items-center"
            >
              <span>Lesson {singleDetails.id}</span>
              <IoMdClose onClick={handleHide} style={{ cursor: "pointer" }} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            className="p-3"
            style={{ backgroundColor: "#353f53", color: "white" }}
          >
            <div className="row mt-2">
              <div className="col-md-5">
                <span className="lesson-main">Lesson</span>
              </div>
              <div className="col-md-7">
                <span>{singleDetails?.content}</span>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <span className="lesson-main">Takeaway</span>
              </div>
              <div className="col-md-7">
                <span>{singleDetails?.takeaway}</span>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <span className="lesson-main">Prices</span>
              </div>
              <div className="col-md-7">
                <span>{singleDetails?.prices} BTC</span>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <span className="lesson-main">Funding End Time</span>
              </div>
              <div className="col-md-7">
                <span>{singleDetails?.fundingEndTime}</span>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <span className="lesson-main">Collection Fund</span>
              </div>
              <div className="col-md-7">
                <span>{singleDetails?.funds} BTC</span>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-5">
                <span className="lesson-main">Quotas</span>
              </div>
              <div className="col-md-7">
                <span>{singleDetails?.quotas} BTC</span>
              </div>
            </div>
            <div className="row mt-3 d-flex align-items-center">
              <div className="col-md-5">
                <span className="lesson-main">Rating</span>
              </div>
              <div className="col-md-7">
                <Rating initialValue={showRating} readOnly={true} />
              </div>
            </div>
            {singleDetails?.completed && (
              <div className="row mt-3">
                <div className="col-md-5">
                  <span className="lesson-main">Status</span>
                </div>
                <div className="col-md-7">
                  <span>Complated</span>
                </div>
              </div>
            )}

            <div className="row mt-4 mb-2 d-flex justify-content-center">
              <div
                className="col-md-10 "
                style={{ borderTop: "1px solid rgba(235, 235, 235, 0.695)" }}
              ></div>
            </div>
            {!singleDetails?.completed && (
              <div className="row mt-4 mb-4 d-flex justify-content-center">
                {owner == connectWallets && (
                  <div className="col-md-3 mt-2">
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-lesson"
                        id="complete_lesson"
                        onClick={() => setText("complete_lesson")}
                      >
                        Complete Lesson
                      </button>
                    </div>
                  </div>
                )}

                <div className="col-md-3 mt-2">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-lesson"
                      id="fund_lesson"
                      onClick={() => setText("fund_lesson")}
                    >
                      Fund Lesson
                    </button>
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-lesson"
                      onClick={handleRefund}
                      disabled={refundLoading}
                    >
                      {refundLoading ? (
                        <div className="text-center">
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Loading...</span>
                        </div>
                      ) : (
                        "Refund"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {text == "complete_lesson" ? (
              <div>
                <h3 className="lesson-main-complete">Complete Lesson</h3>
                <div className="row d-flex justify-content-center">
                  <div className="col-md-8 mt-3 d-flex flex-column">
                    <label>Lesson Id</label>
                    <input
                      type="text"
                      placeholder="Enter Content"
                      className="number-input-content"
                      value={singleDetails.id}
                      readOnly
                    />
                  </div>
                  <div className="col-md-8 mt-3 d-flex flex-column">
                    <label className="mb-2">Rating</label>
                    <Rating onClick={handleRating} />
                    {lessonCreateError && (
                      <span className="error-message text-start">
                        Rating is required
                      </span>
                    )}
                  </div>
                  <div className="col-md-8 mt-3 d-flex flex-column">
                    <button
                      className="btn btn-lesson"
                      id="complete_lesson"
                      onClick={handleCompleteLesson}
                      disabled={lessonCreateLoading}
                    >
                      {lessonCreateLoading ? (
                        <div className="text-center">
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Loading...</span>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : text == "fund_lesson" ? (
              <div>
                <h3 className="lesson-main-complete">Fund Lesson</h3>
                <div className="row d-flex justify-content-center">
                  <div className="col-md-8 mt-3 d-flex flex-column">
                    <label>BNB Price</label>
                    <input
                      type="number"
                      placeholder="Enter Content"
                      className="number-input-content"
                      value={bnbPrice}
                      onChange={(e) => setBNBPrice(e.target.value)}
                      min={1}
                    />
                    {fundLessonError && (
                      <span className="error-message text-start">
                        Please Enter value greater then this Value:
                        {singleDetails.prices}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 mt-3 d-flex flex-column">
                    <button
                      className="btn btn-lesson"
                      id="complete_lesson"
                      onClick={handleFundLesson}
                      disabled={fundLessonLoading}
                    >
                      {fundLessonLoading ? (
                        <div className="text-center">
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Loading...</span>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Card;
