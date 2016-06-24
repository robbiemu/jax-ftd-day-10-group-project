package com.cooksys.ftd.chat.server;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClientHandler implements Runnable, Closeable {

	Logger log = LoggerFactory.getLogger(ClientHandler.class);

	private Server server;
	private String name;
	private Socket client;
	private PrintWriter writer;
	private BufferedReader reader;

	public ClientHandler(Server server, Socket client) throws IOException {
		super();
		this.server = server;
		this.client = client;
		this.reader = new BufferedReader(new InputStreamReader(client.getInputStream()));
		this.writer = new PrintWriter(client.getOutputStream(), true);
		
		writeMessage("****Please enter in a username");
		this.setName(reader.readLine()); 
		log.info("{}: Name set to {}", this.client.getRemoteSocketAddress(), name);
		writeMessage("****Username set to: " + this.name);
		this.server.addLine("has logged in.", this.name, true);
	}

	@Override
	public void run() {
		try {
			log.info("handling client {}", this.client.getRemoteSocketAddress());
			while (!this.client.isClosed()) {
				String echo = reader.readLine();
				log.info("received message [{}] from client {} ({}), echoing...", echo,
						this.name, this.client.getRemoteSocketAddress());
				this.server.addLine(echo, this.name, false);
			}
			log.info("{}: has disconnected.", name);
			this.close();
		} catch (IOException e) {
			this.server.addLine("has disconnected.", this.name, true);
			log.warn("Client is no longer connected. Perhaps he closed out?", e);
		}
	}

	@Override
	public void close() throws IOException {
		log.info("closing connection to client {}", this.client.getRemoteSocketAddress());
		this.server.addLine("has disconnected.", this.name, true);
		this.client.close();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void writeMessage(String message) {
		writer.print(message);
		writer.flush();
	}

}
