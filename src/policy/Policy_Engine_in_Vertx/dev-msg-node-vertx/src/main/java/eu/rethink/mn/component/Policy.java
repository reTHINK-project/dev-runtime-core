package eu.rethink.mn.component;

public class Policy {
	private String subject;
	private String target;
	private String function;

	public Policy(String subject, String target, String function) {
		this.subject = subject;
		this.target = target;
		this.function = function;
	}

	public String getSubject() {
		return this.subject;
	}

	public String getTarget() {
		return this.target;
	}

	public String getFunction() {
		return this.function;
	}
}