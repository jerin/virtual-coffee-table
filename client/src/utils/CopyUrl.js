const copyUrl = () => {
    navigator.clipboard.writeText("http://localhost:3000/");
    alert("Copied to clipboard.");
  };

export default copyUrl;