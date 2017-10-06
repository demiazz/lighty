function onDOMContentLoaded(listener) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", listener);
  } else {
    // See https://connect.microsoft.com/IE/feedback/details/792880/document-readystat
    setTimeout(listener, 1);
  }
}

export default onDOMContentLoaded;
