"use client";

import { useEffect, useRef, useState } from "react";

// One browser cache/request registry means identical active keys share a request.
const records = new Map();
const listeners = new Map();

export async function fetcher(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function recordFor(key) {
  if (!records.has(key)) records.set(key, { data: undefined, error: undefined, updatedAt: 0, promise: null });
  return records.get(key);
}

function notify(key) { listeners.get(key)?.forEach((listener) => listener()); }

function revalidate(key) {
  const record = recordFor(key);
  if (record.promise) return record.promise;
  record.promise = fetcher(key).then((data) => {
    record.data = data;
    record.error = undefined;
    record.updatedAt = Date.now();
    return data;
  }).catch((error) => {
    record.error = error;
    throw error;
  }).finally(() => {
    record.promise = null;
    notify(key);
  });
  notify(key);
  return record.promise;
}

export function useQuery(key, { fallbackData, refreshInterval = 0, staleTime = 0, keepPreviousData = false } = {}) {
  const [, rerender] = useState(0);
  const previous = useRef(undefined);
  if (key && fallbackData !== undefined) {
    const record = recordFor(key);
    if (record.data === undefined) { record.data = fallbackData; record.updatedAt = Date.now(); }
  }
  useEffect(() => {
    if (!key) return;
    const current = recordFor(key);
    if (current.data === undefined || Date.now() - current.updatedAt > staleTime) revalidate(key).catch(() => {});
    if (!refreshInterval) return;
    const timer = setInterval(() => revalidate(key).catch(() => {}), refreshInterval);
    return () => clearInterval(timer);
  }, [key, refreshInterval, staleTime]);

  useEffect(() => {
    if (!key) return;
    const force = () => rerender((n) => n + 1);
    const set = listeners.get(key) || new Set();
    listeners.set(key, set);
    set.add(force);
    return () => { set.delete(force); if (!set.size) listeners.delete(key); };
  }, [key]);

  const record = key ? records.get(key) : null;
  let data = record?.data;
  if (data !== undefined) previous.current = data;
  if (data === undefined && keepPreviousData) data = previous.current;
  return { data, error: record?.error, isLoading: Boolean(key && data === undefined), isValidating: Boolean(record?.promise) };
}
