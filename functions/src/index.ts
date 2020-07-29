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

    db.collection("messagesUnseen")
      .doc(context.params.schoolId)
      .collection("alunos")
      .doc(context.params.alunoId)
      .collection("unseen")
      .doc("Unseen")
      .get()
      .then((doc): any => {
        if (!doc.exists) {
          return db
            .collection("messagesUnseen")
            .doc(context.params.schoolId)
            .collection("alunos")
            .doc(context.params.alunoId)
            .collection("unseen")
            .doc("Unseen")
            .set({
              createdAt: createdAt,
              senderId: senderId,
              count: 1,
            });
        } else {
          if (senderId === doc.get("senderId")) {
            return db
              .collection("messagesUnseen")
              .doc(context.params.schoolId)
              .collection("alunos")
              .doc(context.params.alunoId)
              .collection("unseen")
              .doc("Unseen")
              .set(
                {
                  createdAt: createdAt,
                  senderId: senderId,
                  count: doc.get("count") + 1,
                },
                { merge: true }
              );
          } else {
            return db
              .collection("messagesUnseen")
              .doc(context.params.schoolId)
              .collection("alunos")
              .doc(context.params.alunoId)
              .collection("unseen")
              .doc("Unseen")
              .set(
                {
                  createdAt: createdAt,
                  senderId: senderId,
                  count: 1,
                },
                { merge: true }
              );
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  });
