/*********Toast Messages of indicating success and failure*********/

const successToast = Toastify({
  text: "Content loaded successfully",
  duration: 3000,
  close: true,
  gravity: "bottom",
  position: "right",
  stopOnFocus: true,
  style: {
    background: "#043927",
  },
  onClick: () => successToast.hideToast(),
});
const errorToast = Toastify({
  text: "Unexpected error occured",
  duration: 3000,
  close: true,
  gravity: "bottom",
  position: "right",
  stopOnFocus: true,
  style: {
    background: "#800000",
  },
  onClick: () => errorToast.hideToast(),
});
const successfulPurchaseToast = Toastify({
  text: "Booked a seat hurray!!",
  duration: 3000,
  close: true,
  gravity: "bottom",
  position: "right",
  stopOnFocus: true,
  style: {
    background: "#043927",
  },
  onClick: () => successToast.hideToast(),
});
export { successToast, errorToast, successfulPurchaseToast };
