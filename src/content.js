var context;
var filter;

const init = () => {
  if (context === undefined) {
    context = new AudioContext();
  }

  if (filter === undefined) {
    filter = new DelayNode(context, { maxDelayTime: 179 })
    filter.connect(context.destination);
  }
};

const attach = () => {
  init();

  const audioElem = document.getElementsByTagName("audio");
  const videoElem = document.getElementsByTagName("video");

  for (const element of [...audioElem, ...videoElem]) {
    try {
      var mediaSource = context.createMediaElementSource(element)
      context.resume();
      mediaSource.connect(filter);
      console.log("delay attached.");
    } catch (e) {
      console.log(e)
    }
  }
};

const setDelay = (delay) => {
  delay = delay/1000
  if (filter.delayTime.value !== delay)
    filter.delayTime.value = delay;
}

window.onload = () => {
  attach();
  chrome.storage.sync.get("delay", (value) =>
    setDelay(value.delay)
  )
};

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.delay) {
      setDelay(request.delay);
      sendResponse({ack: true});
    }
  }
);
