export const privacyDraftSaveKey = "privacy-masker:save";
export const privacyDraftTextKey = "privacy-masker:text";

type PrivacyDraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function readPrivacyDraft(storage: PrivacyDraftStorage) {
  try {
    if (storage.getItem(privacyDraftSaveKey) !== "true") return { available: true, save: false, text: "" };
    return { available: true, save: true, text: storage.getItem(privacyDraftTextKey) ?? "" };
  } catch {
    return { available: false, save: false, text: "" };
  }
}

export function savePrivacyDraft(storage: PrivacyDraftStorage, text: string) {
  try {
    storage.setItem(privacyDraftSaveKey, "true");
    storage.setItem(privacyDraftTextKey, text);
    return true;
  } catch {
    return false;
  }
}

export function updatePrivacyDraftText(storage: PrivacyDraftStorage, text: string) {
  try {
    storage.setItem(privacyDraftTextKey, text);
    return true;
  } catch {
    return false;
  }
}

export function clearPrivacyDraft(storage: PrivacyDraftStorage) {
  try {
    storage.removeItem(privacyDraftSaveKey);
    storage.removeItem(privacyDraftTextKey);
    return true;
  } catch {
    return false;
  }
}
