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
      .get()
      .then((doc): any => {
        if (!doc.exists) {
          return db
            .collection("messagesUnseen")
            .doc(context.params.schoolId)
            .collection("alunos")
            .doc(context.params.alunoId)
            .set({
              createdAt: createdAt,
              senderId: senderId,
              count: 1,
              userId: context.params.alunoId,
            });
        } else {
          if (senderId === doc.get("senderId")) {
            return db
              .collection("messagesUnseen")
              .doc(context.params.schoolId)
              .collection("alunos")
              .doc(context.params.alunoId)
              .set(
                {
                  createdAt: createdAt,
                  senderId: senderId,
                  count: doc.get("count") + 1,
                  userId: context.params.alunoId,
                },
                { merge: true }
              );
          } else {
            return db
              .collection("messagesUnseen")
              .doc(context.params.schoolId)
              .collection("alunos")
              .doc(context.params.alunoId)
              .set(
                {
                  createdAt: createdAt,
                  senderId: senderId,
                  count: 1,
                  userId: context.params.alunoId,
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
