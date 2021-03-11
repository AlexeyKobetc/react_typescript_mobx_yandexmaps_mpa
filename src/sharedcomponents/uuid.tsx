const getUUID = () => {
  const h = "0123456789abcdef";
  const k = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let uuid = "";
  let index = 0;
  let randomByte = (Math.random() * 0xffffffff) | 0;

  while (index < k.length) {
    let c = k[index - 1];
    let r = randomByte & 0xf;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    uuid += c == "-" || c == "4" ? c : h[v];
    randomByte = index % 8 == 0 ? (Math.random() * 0xffffffff) | 0 : randomByte >> 4;
    index++;
  }
  return uuid;
};

export default getUUID;
