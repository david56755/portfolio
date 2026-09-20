"""Comprobaciones sin dependencias de test ni llamadas a servicios externos."""
import asyncio
from backend.main import app

async def request(path, host="localhost", method="GET"):
    events = []
    received = False
    async def receive():
        nonlocal received
        if not received:
            received = True
            return {"type": "http.request", "body": b"", "more_body": False}
        await asyncio.Event().wait()
    async def send(message):
        events.append(message)
    await app({"type":"http", "asgi":{"version":"3.0", "spec_version":"2.4"}, "http_version":"1.1", "method":method, "scheme":"http", "path":path, "raw_path":path.encode(), "query_string":b"", "root_path":"", "headers":[(b"host",host.encode())], "client":("127.0.0.1",1234), "server":("localhost",8000)}, receive, send)
    start = next(event for event in events if event["type"] == "http.response.start")
    return start["status"], dict(start["headers"])

async def main():
    for path in ["/", "/api/health", "/api/portfolio"]:
        status, headers = await request(path)
        assert status == 200, (path,status)
        assert headers[b"x-content-type-options"] == b"nosniff"
        assert b"frame-ancestors 'none'" in headers[b"content-security-policy"]
        assert headers[b"referrer-policy"] == b"no-referrer"
    assert (await request("/api/health",host="untrusted.example"))[0] == 400
    assert (await request("/api/portfolio",method="POST"))[0] == 405
    assert (await request("/.env"))[0] == 404
    assert (await request("/docs"))[0] == 404
    print("Backend: headers, allowed hosts, read-only API and private-file isolation passed.")

asyncio.run(main())
