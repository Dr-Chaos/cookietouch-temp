const config = {
  MAX_PODS: 90
};

const move = [
  { map: currentMapId(), custom: test }
];

async function* test() {
  printMessage("Let's go!");
  yield* await npc.npcBank(-1, -1);
  printMessage("Amdr lol");
  yield* await leaveDialog();
  printMessage("Avec vanish les taches s'évanouiche !");
}
