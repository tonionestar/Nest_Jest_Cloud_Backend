import { MailFormatError } from "@clippic/clippic-errors";
import Email from "email-templates";
import nodemailer from "nodemailer";
import path from "path";
import { User } from "../models/User";

export function validateEmail(email: string, traceId: string): void {
    const emailIsInvalid = !validateEmailRegex(email);
    if (emailIsInvalid) {
        throw new MailFormatError(email, traceId);
    }
}

/**
 * Validate email against common RegEx.
 * @param email
 * @returns {boolean}
 */
export function validateEmailRegex(email: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

export class Mailer {
    private sender: string = "\"clippic\" <notification@clippic.app>";
    private smtpServer:string = process.env.SMTP_SERVER;
    private smtpPort:number = Number(process.env.SMTP_PORT);
    private smtpUser:string = process.env.SMTP_USER;
    private smtpPass:string = process.env.SMTP_PASS;

    private envStringVarIsEmpty(env: string) {
        if (env == null || env === "") {
            console.error("SMTP Environment variable is empty.");
        }
    }

    private envNumberVarIsEmpty(env: number) {
        if (env == null || isNaN(env)) {
            console.error("SMTP Environment variable is empty.");
        }
    }

    private validateEnvVars() {
        this.envStringVarIsEmpty(this.smtpServer);
        this.envNumberVarIsEmpty(this.smtpPort);
        this.envStringVarIsEmpty(this.smtpUser);
        this.envStringVarIsEmpty(this.smtpPass);
    }

    private transporter = nodemailer.createTransport({
        host: this.smtpServer,
        pool: true,
        port: this.smtpPort,
        secure: true,
        auth: {
            user: this.smtpUser,
            pass: this.smtpPass
        }
    });

    private email: Email = new Email({
        message: {
            from: this.sender
        },
        send: true,
        htmlToText: false,
        transport: this.transporter,

    });

    constructor() {
        this.validateEnvVars();
    }

    public async sendPasswordResetCode(user: User, passwordResetCode: number) {
        try {
            await this.email.send({
                template: path.join(__dirname, '..', 'emails', 'password-forgotten'),
                message: {
                    to: user.email
                },
                locals: {
                    forename: user.forename,
                    passwordResetCode: passwordResetCode,
                }
            });
        } catch (e) {
            console.log(e)
        }
    }

    public async sendPasswordChanged(user: User) {
        try {
            await this.email.send({
                template: path.join(__dirname, '..', 'emails', 'password-changed'),
                message: {
                    to: user.email
                },
                locals: {
                    forename: user.forename,
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}