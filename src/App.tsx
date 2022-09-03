import { Component, createSignal, For } from "solid-js";
import SelectButton from "./components/SelectButton";

const App: Component = () => {
  const [headImages, setHeadImages] = createSignal([]);
  const [eyebowImages, setEyebowImages] = createSignal([]);
  const [eyeImages, setEyeImages] = createSignal([]);
  const [mouthImages, setMouthImages] = createSignal([]);
  const [detailImages, setDetailImages] = createSignal([]);

  // selected number of sources array
  const [selectedHead, setSelectedHead] = createSignal(0);
  const [selectedEye, setSelectedEye] = createSignal(0);
  const [selectedMouth, setSelectedMouth] = createSignal(0);
  const [selectedEyebow, setSelectedEyebow] = createSignal(0);
  const [selectedDetail, setSelectedDetail] = createSignal(0);

  // selected image of the selected one
  const [selectedHeadImage, setSelectedHeadImage] = createSignal("");
  const [selectedEyeImage, setSelectedEyeImage] = createSignal("");
  const [selectedMouthImage, setSelectedMouthImage] = createSignal("");
  const [selectedEyebowImage, setSelectedEyebowImage] = createSignal("");
  const [selectedDetailImage, setSelectedDetailImage] = createSignal("");

  const loadImage = async () => {
    // bulk import svg
    const headModules = await import.meta.glob("./assets/head/*.svg");
    const eyebowsModules = await import.meta.glob("./assets/eyebows/*.svg");
    const eyesModules = await import.meta.glob("./assets/eyes/*.svg");
    const mouthModules = await import.meta.glob("./assets/mouth/*.svg");
    const detailsModules = await import.meta.glob("./assets/details/*.svg");

    // value is a import function so to get the svgs should loop to execute them
    const headValues = Object.values(headModules).map((m) => m());
    const eyebowsValues = Object.values(eyebowsModules).map((m) => m());
    const eyesValues = Object.values(eyesModules).map((m) => m());
    const mouthValues = Object.values(mouthModules).map((m) => m());
    const detailsValues = Object.values(detailsModules).map((m) => m());

    // remember the bulk import is a Promise so headValue is Promise too
    const _headImages = await Promise.all(headValues);
    const _eyebowImages = await Promise.all(eyebowsValues);
    const _eyeImages = await Promise.all(eyesValues);
    const _mouthImages = await Promise.all(mouthValues);
    const _detailImages = await Promise.all(detailsValues);

    setHeadImages(_headImages);
    setEyebowImages(_eyebowImages);
    setEyeImages(_eyeImages);
    setMouthImages(_mouthImages);
    setDetailImages(_detailImages);
  };

  loadImage();

  const handleClickHead = (i) => {
    setSelectedHead(i);
    setSelectedHeadImage(headImages()[i()].default);
  };
  const handleClickEye = (i) => {
    setSelectedEye(i);
    setSelectedEyeImage(eyeImages()[i()].default);
  };
  const handleClickMouth = (i) => {
    setSelectedMouth(i);
    setSelectedMouthImage(mouthImages()[i()].default);
  };
  const handleClickEyebow = (i) => {
    setSelectedEyebow(i);
    setSelectedEyebowImage(eyebowImages()[i()].default);
  };
  const handleClickDetail = (i) => {
    setSelectedMouth(i);
    setSelectedDetailImage(detailImages()[i()].default);
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const getRandomEmojiCombination = () => {};

  return (
    <>
      <div mx-10 mt-10>
        <h1 text-3xl font-bold mb-5>
          Emoji Maker
        </h1>
        {/* head */}
        <h2 mt-4 text-xl font-bold>
          face
        </h2>
        <div flex="~ row wrap" gap-2>
          <For each={headImages()}>
            {(item, index) => (
              <SelectButton>
                <img
                  onClick={[handleClickHead, index]}
                  src={item.default}
                  alt=""
                />
              </SelectButton>
            )}
          </For>
        </div>
        {/* eyebow */}
        <h2 mt-8 text-xl font-bold>
          Eyebow
        </h2>
        <div flex="~ row wrap" gap-2>
          <For each={eyebowImages()}>
            {(item, index) => (
              <SelectButton>
                <img
                  onClick={[handleClickEyebow, index]}
                  src={item.default}
                  alt=""
                />
              </SelectButton>
            )}
          </For>
        </div>
        {/* eye */}
        <h2 mt-8 text-xl font-bold>
          Eye
        </h2>
        <div flex="~ row wrap" gap-2>
          <For each={eyeImages()}>
            {(item, index) => (
              <SelectButton>
                <img
                  onClick={[handleClickEye, index]}
                  src={item.default}
                  alt=""
                />
              </SelectButton>
            )}
          </For>
        </div>
        {/* mouth */}
        <h2 mt-8 text-xl font-bold>
          Mouth
        </h2>
        <div flex="~ row wrap" gap-2>
          <For each={mouthImages()}>
            {(item, index) => (
              <SelectButton>
                <img
                  onClick={[handleClickMouth, index]}
                  src={item.default}
                  alt=""
                />
              </SelectButton>
            )}
          </For>
        </div>
        {/* detail */}
        <h2 mt-8 text-xl font-bold>
          Detail
        </h2>
        <div flex="~ row wrap" gap-2>
          <For each={detailImages()}>
            {(item, index) => (
              <SelectButton>
                <img
                  onClick={[handleClickDetail, index]}
                  src={item.default}
                  alt=""
                />
              </SelectButton>
            )}
          </For>
        </div>
      </div>

      <div my-8 border h-40 mx-10>
        <img class="absolute w-24 h-24" src={selectedHeadImage()} alt="" />
        <img class="absolute w-24 h-24" src={selectedEyeImage()} alt="" />
        <img class="absolute w-24 h-24" src={selectedMouthImage()} alt="" />
        <img class="absolute w-24 h-24" src={selectedEyebowImage()} alt="" />
        <img class="absolute w-24 h-24" src={selectedDetailImage()} alt="" />
      </div>

      <button></button>
    </>
  );
};

export default App;
