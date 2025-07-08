import { app } from "../firebase";

export default class playersServices {
  url: string;

  constructor() {
    this.url = "https://juego-indol.vercel.app";
    // this.url = "http://localhost";
  }

  async setJugador(jugador: any, partida: string) {
    // return await app
    //   .firestore()
    //   .collection("juego")
    //   .doc("jugadores")
    //   .collection("datos")
    //   .doc(jugador.id)
    //   .set(jugador);
    return await app
      .firestore()
      .collection("juego")
      .doc("partida")
      .collection("datos")
      .doc(partida)
      .collection("jugadores")
      .doc(jugador.id)
      .set(jugador);
  }

  async updateJugador(jugador: any) {
    return await app
      .firestore()
      .collection("juego")
      .doc("jugadores")
      .collection("datos")
      .doc(jugador.id)
      .update(jugador);
  }

  async getListPlayers(partida: string) {
    // return await app
    //   .firestore()
    //   .collection("juego")
    //   .doc("jugadores")
    //   .collection("datos")
    //   .get();
    return await app
      .firestore()
      .collection("juego")
      .doc("partida")
      .collection("datos")
      .doc(partida)
      .collection("jugadores")
      .get();
  }

  async getJugador(id: string) {
    return await app
      .firestore()
      .collection("juego")
      .doc("jugadores")
      .collection("datos")
      .doc(id)
      .get();
  }

  async DeleteJugador(id: string) {
    return await app
      .firestore()
      .collection("juego")
      .doc("jugadores")
      .collection("datos")
      .doc(id)
      .delete();
  }

  async setChooseJugador(idJugador: string, respuesta: any) {
    return await app
      .firestore()
      .collection("juego")
      .doc("jugadores")
      .collection("datos")
      .doc(idJugador)
      .update(respuesta);
  }
}
