import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAllImagesRecursive, getCachedImages } from "../../src/services/githubService.js"; // adjust the path

const mockFetch = vi.fn();

// Mock fetch globally
globalThis.fetch = mockFetch;

let localStorageMock;
beforeEach(() => {
    localStorageMock = (() => {
        let store = {};
        return {
            getItem: vi.fn((key) => store[key] || null),
            setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
            clear: vi.fn(() => { store = {}; }),
        };
    })();

    Object.defineProperty(globalThis, "localStorage", {
        value: localStorageMock,
        configurable: true,
    });

    vi.useFakeTimers();
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
});

describe("fetchAllImagesRecursive", () => {
    it("fetches image files and groups them by folder", async () => {
        // Mock API response for root path
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ([
                { type: "file", name: "frieren1.jpg", download_url: "url1" },
                { type: "file", name: "frieren2.png", download_url: "url2" },
            ]),
        });

        const data = await fetchAllImagesRecursive("luantran", "anime-wallpapers");
        expect(mockFetch).toHaveBeenCalledWith(
            "https://api.github.com/repos/luantran/anime-wallpapers/contents/?ref=main"
        );

        expect(data).toEqual({
            root: ["url1", "url2"],
        });
    });

    it("recursively fetches images from subdirectories", async () => {
        // First call returns a folder
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ([{ type: "dir", path: "subfolder" }]),
            })
            // Second call (subfolder)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ([
                    { type: "file", name: "sub1.jpg", download_url: "url3" },
                ]),
            });

        const data = await fetchAllImagesRecursive("luantran", "anime-wallpapers");
        expect(Object.keys(data)).toContain("subfolder");
        expect(data.subfolder).toEqual(["url3"]);
    });

    it("throws an error if GitHub API returns non-ok", async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });
        await expect(fetchAllImagesRecursive("fake", "repo")).rejects.toThrow(
            /GitHub API error 404/
        );
    });
});

describe("getCachedImages", () => {
    it("returns cached data when valid and not expired", async () => {
        const fakeData = { root: ["cached1.jpg"] };
        const now = Date.now();
        localStorageMock.getItem
            .mockImplementationOnce(() => JSON.stringify(fakeData)) // allImages
            .mockImplementationOnce(() => now.toString()); // allImages_time

        // Still within expiry window
        vi.setSystemTime(now + 500);
        const result = await getCachedImages("luantran", "anime-wallpapers");

        expect(result).toEqual(fakeData);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it("fetches fresh data when cache expired", async () => {
        const fakeNewData = { root: ["fresh1.jpg"] };

        // Cached expired 2 minutes ago
        const oldTime = Date.now() - 120000;
        localStorageMock.getItem
            .mockImplementationOnce(() => JSON.stringify({ root: ["old.jpg"] }))
            .mockImplementationOnce(() => oldTime.toString());

        // Mock fetchAllImagesRecursive result
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ([
                { type: "file", name: "fresh1.jpg", download_url: "fresh1.jpg" },
            ]),
        });

        const result = await getCachedImages("luantran", "anime-wallpapers");
        expect(result.root).toContain("fresh1.jpg");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "allImages",
            JSON.stringify(result)
        );
    });

    it("forces refresh even if cache is valid", async () => {
        const now = Date.now();
        localStorageMock.getItem
            .mockImplementationOnce(() => JSON.stringify({ root: ["cached1.jpg"] }))
            .mockImplementationOnce(() => now.toString());

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ([
                { type: "file", name: "fresh.jpg", download_url: "fresh.jpg" },
            ]),
        });

        const result = await getCachedImages("luantran", "anime-wallpapers", true);
        expect(result.root).toContain("fresh.jpg");
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});
