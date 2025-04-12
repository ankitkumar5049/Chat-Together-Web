import { auth, db } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";

const MAIL_EXTENSION = "@username.com";

export const login = async (
  username: string,
  password: string,
  onResult: (success: boolean) => void
) => {
  if (!username.endsWith(".com")) {
    username += MAIL_EXTENSION;
  }

  try {
    await signInWithEmailAndPassword(auth, username, password);
    onResult(true);
    console.log("Login Success");
  } catch (error) {
    console.error("Login error:", error);
    onResult(false);
  }
};

export const signUpUser = async (
  name: string,
  username_: string,
  dob: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  try {
    let username = username_;
    if (!username_.endsWith(".com")) {
      username += MAIL_EXTENSION;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      username,
      password
    );
    const userId = userCredential.user.uid;

    const userData = {
      user_id: userId,
      name,
      username,
      dob,
      createdAt: format(new Date(), "yyyy-MM-dd"),
      userDeleted: 0,
    };

    // Save to Firestore
    await setDoc(doc(db, "users", userId), userData);

    // Optional: Save to local storage or indexedDB if needed
    return { success: true, message: "Sign-up successful!" };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { success: false, message: error.message || "Sign-up failed" };
  }
};
