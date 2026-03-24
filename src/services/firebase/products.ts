import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { firestore } from './config';
import { Product, ProductInput } from '../../shared/types/product';
import { ProductLog, ProductLogAction } from '../../shared/types/log';

function userProductsCollection(userId: string) {
    return collection(firestore, 'users', userId, 'products');
}

function userLogsCollection(userId: string) {
    return collection(firestore, 'users', userId, 'product_logs');
}

function timestampToIso(value: unknown): string {
    if (value instanceof Timestamp) {
        return value.toDate().toISOString();
    }

    return new Date().toISOString();
}

function mapProduct(docId: string, data: Record<string, unknown>): Product {
    return {
        id: docId,
        name: String(data.name ?? ''),
        description: String(data.description ?? ''),
        price: Number(data.price ?? 0),
        category: String(data.category ?? 'Outros') as Product['category'],
        stockQuantity: Number(data.stockQuantity ?? 0),
        createdAt: timestampToIso(data.createdAt),
        updatedAt: timestampToIso(data.updatedAt),
    };
}

function mapLog(docId: string, data: Record<string, unknown>): ProductLog {
    return {
        id: docId,
        productId: String(data.productId ?? ''),
        productName: String(data.productName ?? ''),
        action: String(data.action ?? 'UPDATE') as ProductLogAction,
        timestamp: timestampToIso(data.timestamp),
        userId: String(data.userId ?? ''),
        userEmail: data.userEmail ? String(data.userEmail) : null,
    };
}

export function subscribeProducts(userId: string, callback: (products: Product[]) => void): () => void {
    const productsQuery = query(userProductsCollection(userId), orderBy('updatedAt', 'desc'));

    return onSnapshot(productsQuery, (snapshot) => {
        const products = snapshot.docs.map((productDoc) => {
            const data = productDoc.data() as Record<string, unknown>;
            return mapProduct(productDoc.id, data);
        });

        callback(products);
    });
}

export async function createProduct(input: ProductInput, user: { uid: string; email?: string | null }): Promise<void> {
    const newDoc = await addDoc(userProductsCollection(user.uid), {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await addDoc(userLogsCollection(user.uid), {
        productId: newDoc.id,
        productName: input.name,
        action: 'CREATE',
        userId: user.uid,
        userEmail: user.email ?? null,
        timestamp: serverTimestamp(),
    });
}

export async function updateProduct(
    id: string,
    input: ProductInput,
    user: { uid: string; email?: string | null },
): Promise<void> {
    const target = doc(firestore, 'users', user.uid, 'products', id);

    await updateDoc(target, {
        ...input,
        updatedAt: serverTimestamp(),
    });

    await addDoc(userLogsCollection(user.uid), {
        productId: id,
        productName: input.name,
        action: 'UPDATE',
        userId: user.uid,
        userEmail: user.email ?? null,
        timestamp: serverTimestamp(),
    });
}

export async function removeProduct(
    product: Pick<Product, 'id' | 'name'>,
    user: { uid: string; email?: string | null },
): Promise<void> {
    await deleteDoc(doc(firestore, 'users', user.uid, 'products', product.id));

    await addDoc(userLogsCollection(user.uid), {
        productId: product.id,
        productName: product.name,
        action: 'DELETE',
        userId: user.uid,
        userEmail: user.email ?? null,
        timestamp: serverTimestamp(),
    });
}

export async function listProductLogs(userId: string, limit = 20): Promise<ProductLog[]> {
    const logsQuery = query(userLogsCollection(userId), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(logsQuery);

    return snapshot.docs
        .slice(0, limit)
        .map((logDoc) => mapLog(logDoc.id, logDoc.data() as Record<string, unknown>));
}
