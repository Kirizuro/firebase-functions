import * as functions from "firebase-functions";

import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const MessagesUnseen = functions.firestore
  .document(
    "schoolsMessages/{schoolId}/responsaveis/{responsavelId}/alunos/{alunoId}/messages/{messageId}"
  )
  .onWrite(async (change, context) => {
    const after: any = change.after.data();

    const {
      user: { senderId },
      createdAt,
    } = after;

    db.collection("MessagesUnseen")
      .doc(context.params.schoolId)
      .collection("responsaveis")
      .doc(context.params.responsavelId)
      .collection("alunos")
      .doc(context.params.alunoId)
      .collection("messages")
      .get()
      .then((docs) =>
        docs.docs.map((doc) => {
          if (!doc.exists) {
            return db
              .collection("MessagesUnseen")
              .doc(context.params.schoolId)
              .collection("responsaveis")
              .doc(context.params.responsavelId)
              .collection("alunos")
              .doc(context.params.alunoId)
              .collection("messages")
              .doc()
              .set({
                createdAt: createdAt,
                senderId: senderId,
                count: 1,
              });
          } else {
            if (senderId === doc.data().senderId) {
              return db
                .collection("MessagesUnseen")
                .doc(context.params.schoolId)
                .collection("responsaveis")
                .doc(context.params.responsavelId)
                .collection("alunos")
                .doc(context.params.alunoId)
                .collection("messages")
                .doc()
                .set({
                  timeStamp: createdAt,
                  senderId: senderId,
                  count: doc.data().count++,
                });
            } else {
              return db
                .collection("MessagesUnseen")
                .doc(context.params.schoolId)
                .collection("responsaveis")
                .doc(context.params.responsavelId)
                .collection("alunos")
                .doc(context.params.alunoId)
                .collection("messages")
                .doc()
                .set({
                  createdAt: createdAt,
                  senderId: senderId,
                  count: 1,
                });
            }
          }
        })
      )
      .catch((err) => {
        throw err;
      });
  });
