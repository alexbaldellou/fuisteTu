import { app } from "../firebase";

export default class gameServices {
  url: string;

  constructor() {
    this.url = "https://juego-indol.vercel.app";
    // this.url = "http://localhost";
  }

  async setPartida(id: string, status: boolean) {
    const info = { status: status };
    return await app
      .firestore()
      .collection("juego")
      .doc("partida")
      .collection("datos")
      .doc(id)
      .set(info);
  }

  async getPartida(id: string) {
    return await app
      .firestore()
      .collection("juego")
      .doc("partida")
      .collection("datos")
      .doc(id)
      .get();
  }

  async updateGame(id: string, partida: any) {
    return await app
      .firestore()
      .collection("juego")
      .doc("partida")
      .collection("datos")
      .doc(id)
      .update(partida);
  }

  async updateQuestion(id: string, partida: any) {
    return await app
      .firestore()
      .collection("juego")
      .doc("preguntas")
      .collection("datos")
      .doc(id)
      .update(partida);
  }

  async getListQuestions() {
    return await app
      .firestore()
      .collection("juego")
      .doc("preguntas")
      .collection("datos")
      .get();
  }

  async setListQuestions(id: string, info: any) {
    return await app
      .firestore()
      .collection("juego")
      .doc("preguntas")
      .collection("datos")
      .doc(id)
      .update(info);
  }
}
