import {
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import SelectButton from "./components/SelectButton";

type SvgImageModule = typeof import("*.svg");
type ImportModuleFunction = () => Promise<SvgImageModule>;
type EmojiSlice = "head" | "eye" | "eyebow" | "mouth" | "detail";

const tabs: EmojiSlice[] = ["head", "eye", "eyebow", "mouth", "detail"];
let canvas: HTMLCanvasElement,
  canvasSize = 640;

/**
 * get images path
 * @param path
 * @returns
 */
const imagePath = (path: string) => {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (path === "") {
      resolve(null);
    }
    const img = new Image(400, 400);
    img.src = path;
    img.onload = (e) => {
      resolve(img);
    };
  });
};

/**
 * Function to get svg
 * @param modules
 * @returns svg
 */
const resolveImportGLobModule = async (
  modules: Record<string, ImportModuleFunction>
) => {
  const imports = Object.values(modules).map((importFn) => importFn());
  const loadedModules = await Promise.all(imports);

  return loadedModules.map((module) => module.default);
};

const App: Component = () => {
  const [images, setImages] = createSignal({
    head: [],
    eyebow: [],
    eye: [],
    mouth: [],
    detail: [],
  });
  const [selectedTab, setSelectedTab] = createSignal<EmojiSlice>("head");
  const [selectedIndex, setSelectedIndex] = createSignal({
    head: 0,
    eyebow: 0,
    eye: 0,
    mouth: 0,
    detail: 0,
  });

  const selectedImage = () => {
    return {
      head: images().head[selectedIndex().head],
      eyebow: images().eyebow[selectedIndex().eyebow],
      eye: images().eye[selectedIndex().eye],
      mouth: images().mouth[selectedIndex().mouth],
      detail: images().detail[selectedIndex().detail],
    };
  };

  const loadImage = async () => {
    // bulk import svg
    const headModules = import.meta.glob<SvgImageModule>("./assets/head/*.svg");
    const eyebowModules = import.meta.glob<SvgImageModule>(
      "./assets/eyebows/*.svg"
    );
    const eyeModules = import.meta.glob<SvgImageModule>("./assets/eyes/*.svg");
    const mouthModules = import.meta.glob<SvgImageModule>(
      "./assets/mouth/*.svg"
    );
    const detailModules = import.meta.glob<SvgImageModule>(
      "./assets/details/*.svg"
    );

    const _headImages = await resolveImportGLobModule(headModules);
    const _eyebowImages = await resolveImportGLobModule(eyebowModules);
    const _eyeImages = await resolveImportGLobModule(eyeModules);
    const _mouthImages = await resolveImportGLobModule(mouthModules);
    const _detailImages = await resolveImportGLobModule(detailModules);

    setImages({
      head: _headImages,
      eyebow: [..._eyebowImages],
      eye: [..._eyeImages],
      mouth: [..._mouthImages],
      detail: [..._detailImages],
    });

    getRandomEmojiCombination();
  };

  onMount(() => {
    loadImage();
  });

  createEffect(() => {
    const headPath = selectedImage().head;
    const eyebowPath = selectedImage().eyebow;
    const eyePath = selectedImage().eye;
    const mouthPath = selectedImage().mouth;
    const detailPath = selectedImage().detail;
    Promise.all([
      imagePath(headPath),
      imagePath(eyebowPath),
      imagePath(eyePath),
      imagePath(mouthPath),
      imagePath(detailPath),
    ]).then((images) => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      images.forEach((img) => {
        img && ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      });
      canvas.classList.add("animation");
      setTimeout(() => {
        canvas.classList.remove("animation");
      }, 500);
    });
  });

  const handleSelectItem = ({ tab, index }: { tab: string; index: number }) => {
    console.log(tab, index);
    setSelectedIndex({ ...selectedIndex(), [tab]: index });
  };

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // random emoji
  const getRandomEmojiCombination = () => {
    const randomIndexes = {
      head: randomInt(0, images().head.length - 1),
      eye: randomInt(0, images().eye.length - 1),
      eyebow: randomInt(0, images().eyebow.length - 1),
      mouth: randomInt(0, images().mouth.length - 1),
      detail: randomInt(0, images().detail.length - 1),
    };
    setSelectedIndex(randomIndexes);
  };

  // export image
  const exportImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emoji_${Date.now()}`;
    a.click();
  };

  // export svg
  const toSvgBlob = async () => {
    const parser = new DOMParser();
    const documents = await Promise.all(
      Object.values(selectedImage()).map((image) =>
        fetch(image).then((response) => response.text())
      )
    );
    const svg = (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {documents.flatMap((document) => [
          ...parser.parseFromString(document, "image/svg+xml").documentElement
            .childNodes,
        ])}
      </svg>
    ) as HTMLElement;
    return new Blob([svg.outerHTML], { type: "image/svg+xml" });
  };

  return (
    <>
      <main
        flex="~ col"
        items-center
        justify-center
        gap-4
        max-w="65ch"
        mt-5
        px-6
        py-12
        mx-auto
        bg-white
        rounded-lg
        bg-op-80
        shadow="2xl black/10"
        dark:bg-dark
        md:px-24
      >
        <div
          flex
          items-center
          justify-center
          w="200px"
          h="200px"
          border-2
          border-neutral-400
          border-op-20
          rounded-2xl
        >
          <canvas
            ref={canvas}
            width={canvasSize}
            height={canvasSize}
            w="160px"
            h="160px"
            class="animation"
          ></canvas>
        </div>
        <div flex h-12 gap-2>
          <div
            flex
            items-center
            justify-center
            w-12
            rounded-full
            bg-neutral-100
            dark:bg-neutral-600
            text-black
            dark:text-white
            cursor-pointer
            transition-colors
            hover="bg-violet-200 dark:bg-violet-400"
            onClick={getRandomEmojiCombination}
          >
            <div i-material-symbols-refresh text-2xl />
          </div>
          <div
            inline-flex
            px-3
            items-center
            gap-1
            rounded-full
            bg-neutral-100
            dark:bg-neutral-600
            text-black
            dark:text-white
            cursor-pointer
            transition-colors
            hover="bg-violet-200 dark:bg-violet-400"
            onClick={() => canvas.toBlob(exportImage)}
          >
            <div i-material-symbols-download-rounded text-2xl />
            <span font-bold mr-1>
              Export PNG
            </span>
          </div>
          <div
            inline-flex
            px-3
            items-center
            gap-1
            rounded-full
            bg-neutral-100
            dark:bg-neutral-600
            text-black
            dark:text-white
            cursor-pointer
            transition-colors
            hover="bg-violet-200 dark:bg-violet-400"
            onClick={() => toSvgBlob().then(exportImage)}
          >
            <div i-material-symbols-download-rounded text-2xl />
            <span font-bold mr-1>
              Export SVG
            </span>
          </div>
        </div>
        <div w-full mt-4>
          <header
            flex
            flex-wrap
            items-center
            gap-3
            p-4
            border-b
            border-neutral-400
            border-op-20
            justify-center
          >
            <For each={tabs}>
              {(item, index) => (
                <div
                  flex
                  items-center
                  justify-center
                  h-16
                  w-16
                  rounded-lg
                  cursor-pointer
                  transition-colors
                  hover="bg-violet-200 dark:bg-violet-200"
                  class={
                    selectedTab() === item
                      ? "bg-violet-200 dark:bg-violet-200"
                      : "bg-neutral-100 dark:bg-neutral-600"
                  }
                  onClick={() => setSelectedTab(item)}
                >
                  <Show when={selectedImage()[item]}>
                    <img
                      src={selectedImage()[item]}
                      alt={selectedTab() + index()}
                      h-12
                      w-12
                    ></img>
                  </Show>
                </div>
              )}
            </For>
          </header>
          <main p-4>
            <div flex="~ wrap" gap-2 justify-center>
              <Switch>
                <For each={Object.keys(images())}>
                  {(tab: EmojiSlice) => (
                    <Match when={tab === selectedTab()}>
                      <For each={images()[tab]}>
                        {(item, index) => (
                          <SelectButton
                            highlight={() =>
                              index() === selectedIndex()[selectedTab()]
                            }
                            onClick={[
                              handleSelectItem,
                              { tab: selectedTab(), index: index() },
                            ]}
                          >
                            <Show when={item}>
                              <img
                                src={item}
                                alt={selectedTab() + index()}
                                h-10
                                w-10
                              ></img>
                            </Show>
                          </SelectButton>
                        )}
                      </For>
                    </Match>
                  )}
                </For>
              </Switch>
            </div>
          </main>
        </div>
      </main>
    </>
  );
};

export default App;
